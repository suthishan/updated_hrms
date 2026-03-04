'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ─── Scheduled Notification Jobs ──────────────────────────────────────────────
const { observations, users } = require('./data/mockData');
const emailService = require('./services/emailService');

function isOverdue(targetDate, status) {
  if (status === 'Closed') return false;
  return new Date(targetDate) < new Date();
}

function getDaysUntil(targetDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Daily job (runs at 8:00 AM) — T-15 and T-0 reminders
 * Cron: 0 8 * * *
 */
cron.schedule('0 8 * * *', async () => {
  console.log('[Cron] Running daily reminder job...');
  const today = new Date().toISOString().split('T')[0];

  for (const obs of observations) {
    if (!obs.isPublished) continue;
    for (const ai of obs.actionItems) {
      if (ai.status === 'Closed') continue;
      const days = getDaysUntil(ai.currentTargetDate);

      if (days === 15) {
        console.log(`[Cron] Sending T-15 reminder to ${ai.responsiblePersonEmail}`);
        await emailService.sendT15Reminder(ai, obs).catch(console.error);
      } else if (days === 0) {
        console.log(`[Cron] Sending T-0 reminder to ${ai.responsiblePersonEmail}`);
        await emailService.sendT0Reminder(ai, obs).catch(console.error);
      }
    }
  }
}, { timezone: 'Asia/Kolkata' });

/**
 * Monthly escalation job — runs at 8:00 AM on the 25th of every month
 * Cron: 0 8 25 * *
 */
cron.schedule('0 8 25 * *', async () => {
  console.log('[Cron] Running monthly escalation job (25th)...');

  // Group overdue items by HoD division
  const divisionGroups = {};

  for (const obs of observations) {
    if (!obs.isPublished) continue;
    for (const ai of obs.actionItems) {
      if (!isOverdue(ai.currentTargetDate, ai.status)) continue;

      if (!divisionGroups[obs.division]) {
        divisionGroups[obs.division] = { items: [], hod: null };
      }
      divisionGroups[obs.division].items.push({ actionItem: ai, observation: obs });
      if (!divisionGroups[obs.division].hod) {
        divisionGroups[obs.division].hod = users.find(
          (u) => u.role === 'HoD' && u.division === obs.division
        );
      }
    }
  }

  for (const [division, group] of Object.entries(divisionGroups)) {
    if (!group.items.length) continue;
    const hodEmail = group.hod?.email;
    console.log(`[Cron] Sending escalation for ${division} (${group.items.length} items)`);
    await emailService.sendMonthlyEscalation(group.items, hodEmail).catch(console.error);
  }
}, { timezone: 'Asia/Kolkata' });

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║    Audit CAR Portal Backend API              ║`);
  console.log(`╠══════════════════════════════════════════════╣`);
  console.log(`║  Port    : ${PORT}                                ║`);
  console.log(`║  Env     : ${process.env.NODE_ENV || 'development'}                     ║`);
  console.log(`║  Health  : http://localhost:${PORT}/api/health    ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
});

module.exports = app;
