'use strict';

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middleware/auth');
const { authorize, canAccessObservation } = require('../middleware/rbac');
const { observations, users, notificationLog } = require('../data/mockData');
const emailService = require('../services/emailService');

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeOverallStatus(actionItems) {
  if (!actionItems.length) return 'Open';
  const allClosed = actionItems.every((ai) => ai.status === 'Closed');
  const someClosed = actionItems.some((ai) => ai.status === 'Closed');
  if (allClosed) return 'Closed';
  if (someClosed) return 'Partially Closed';
  return 'Open';
}

function isOverdue(currentTargetDate, status) {
  if (status === 'Closed') return false;
  return new Date(currentTargetDate) < new Date();
}

function recomputeStatuses(obs) {
  obs.actionItems.forEach((ai) => {
    if (ai.status !== 'Closed' && ai.status !== 'Request Closure') {
      if (isOverdue(ai.currentTargetDate, ai.status)) {
        ai.status = 'Overdue';
      }
    }
  });
  obs.overallStatus = computeOverallStatus(obs.actionItems);
}

// ─── GET /api/observations ─────────────────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  const { year, division, riskRating, status, search } = req.query;
  let result = observations.map((o) => { recomputeStatuses(o); return o; });

  // Filter by role
  if (req.user.role === 'Responsible Person') {
    result = result.filter((o) =>
      o.actionItems.some((ai) => ai.responsiblePersonId === req.user.id)
    );
  } else if (req.user.role === 'HoD') {
    result = result.filter((o) => o.division === req.user.division);
  }

  if (year) result = result.filter((o) => o.auditYear === parseInt(year, 10));
  if (division) result = result.filter((o) => o.division === division);
  if (riskRating) result = result.filter((o) => o.riskRating === riskRating);
  if (status) result = result.filter((o) => o.overallStatus === status);
  if (search) {
    const term = search.toLowerCase();
    result = result.filter((o) =>
      o.observationId.toLowerCase().includes(term) ||
      o.observation.toLowerCase().includes(term) ||
      o.auditArea.toLowerCase().includes(term)
    );
  }

  res.json({ data: result, totalData: result.length });
});

// ─── GET /api/observations/dashboard/stats ────────────────────────────────────
router.get('/dashboard/stats', authenticate, (req, res) => {
  let obs = observations;
  if (req.user.role === 'HoD') {
    obs = obs.filter((o) => o.division === req.user.division);
  }

  const allAIs = obs.flatMap((o) => o.actionItems);
  const overdueCount = allAIs.filter((ai) => isOverdue(ai.currentTargetDate, ai.status)).length;

  const riskMap = { High: 0, Medium: 0, Low: 0, Improvement: 0 };
  obs.forEach((o) => { if (riskMap[o.riskRating] !== undefined) riskMap[o.riskRating]++; });

  const divMap = {};
  obs.forEach((o) => {
    if (!divMap[o.division]) divMap[o.division] = { division: o.division, count: 0, open: 0, closed: 0 };
    divMap[o.division].count++;
    if (o.overallStatus === 'Closed') divMap[o.division].closed++;
    else divMap[o.division].open++;
  });

  const yearMap = {};
  obs.forEach((o) => {
    if (!yearMap[o.auditYear]) yearMap[o.auditYear] = { year: o.auditYear, total: 0, open: 0, closed: 0 };
    yearMap[o.auditYear].total++;
    if (o.overallStatus === 'Closed') yearMap[o.auditYear].closed++;
    else yearMap[o.auditYear].open++;
  });

  res.json({
    totalObservations: obs.length,
    openObservations: obs.filter((o) => o.overallStatus === 'Open').length,
    closedObservations: obs.filter((o) => o.overallStatus === 'Closed').length,
    overdueObservations: overdueCount,
    partiallyClosedObservations: obs.filter((o) => o.overallStatus === 'Partially Closed').length,
    byRiskRating: riskMap,
    byDivision: Object.values(divMap),
    byYear: Object.values(yearMap).sort((a, b) => b.year - a.year),
    responsiblePersonStats: buildPersonStats(allAIs),
  });
});

function buildPersonStats(actionItems) {
  const map = {};
  actionItems.forEach((ai) => {
    if (!map[ai.responsiblePersonName]) {
      map[ai.responsiblePersonName] = { name: ai.responsiblePersonName, total: 0, open: 0, closed: 0, overdue: 0 };
    }
    const s = map[ai.responsiblePersonName];
    s.total++;
    if (ai.status === 'Closed') s.closed++;
    else s.open++;
    if (isOverdue(ai.currentTargetDate, ai.status)) s.overdue++;
  });
  return Object.values(map);
}

// ─── GET /api/observations/:id ────────────────────────────────────────────────
router.get('/:id', authenticate, canAccessObservation, (req, res) => {
  const obs = req.observation || observations.find(
    (o) => o.id === req.params.id || o.observationId === req.params.id
  );
  if (!obs) return res.status(404).json({ message: 'Not found' });
  recomputeStatuses(obs);
  res.json(obs);
});

// ─── POST /api/observations ───────────────────────────────────────────────────
router.post('/', authenticate, authorize('Audit Team'), (req, res) => {
  const { auditYear, auditArea, division, riskRating, observation,
    detailsOfFindings, managementCommitment, actionItems, isPublished } = req.body;

  if (!auditYear || !auditArea || !division || !riskRating || !observation || !managementCommitment) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const observationId = `OBS-${auditYear}-${rand}`;
  const now = new Date().toISOString().split('T')[0];

  const newObs = {
    id: uuidv4(),
    observationId,
    auditYear: parseInt(auditYear, 10),
    auditArea, division, riskRating, observation,
    detailsOfFindings, managementCommitment,
    auditorClosureComment: null,
    overallStatus: 'Open',
    createdBy: req.user.id,
    createdByName: req.user.name,
    createdDate: now,
    publishedDate: isPublished ? now : null,
    isPublished: !!isPublished,
    actionItems: (actionItems || []).map((ai, idx) => {
      const user = users.find((u) => u.id === ai.responsiblePersonId);
      return {
        id: `AI-${rand}-${String(idx + 1).padStart(2, '0')}`,
        observationId,
        responsiblePersonId: ai.responsiblePersonId,
        responsiblePersonName: user?.name ?? '',
        responsiblePersonEmail: user?.email ?? '',
        department: user?.department ?? '',
        division: user?.division ?? '',
        initialTargetDate: ai.initialTargetDate,
        currentTargetDate: ai.initialTargetDate,
        status: 'Not Due',
        actionTaken: null, managementComment: null,
        auditorConfirmationStatus: 'Pending',
        auditorConfirmationComment: null, closureDate: null,
        followUps: [], targetDateRevisions: [],
      };
    }),
  };

  observations.push(newObs);

  // Send assignment notifications if published
  if (isPublished) {
    newObs.actionItems.forEach((ai) =>
      emailService.sendAssignmentNotification(ai, newObs).catch(console.error)
    );
  }

  res.status(201).json(newObs);
});

// ─── PUT /api/observations/:id ────────────────────────────────────────────────
router.put('/:id', authenticate, authorize('Audit Team'), (req, res) => {
  const idx = observations.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });

  const obs = observations[idx];
  const updates = req.body;
  const wasPublished = obs.isPublished;

  Object.assign(obs, updates, { id: obs.id, observationId: obs.observationId });
  if (!wasPublished && updates.isPublished) {
    obs.publishedDate = new Date().toISOString().split('T')[0];
    obs.actionItems.forEach((ai) =>
      emailService.sendAssignmentNotification(ai, obs).catch(console.error)
    );
  }

  res.json(obs);
});

// ─── PATCH /api/observations/:id/close ───────────────────────────────────────
router.patch('/:id/close', authenticate, authorize('Audit Team'), (req, res) => {
  const obs = observations.find((o) => o.id === req.params.id);
  if (!obs) return res.status(404).json({ message: 'Not found' });

  obs.overallStatus = 'Closed';
  obs.auditorClosureComment = req.body.auditorClosureComment;
  res.json(obs);
});

// ─── POST /api/observations/:id/action-items/:aiId/follow-up ─────────────────
router.post('/:id/action-items/:aiId/follow-up', authenticate, (req, res) => {
  const obs = observations.find((o) => o.id === req.params.id);
  if (!obs) return res.status(404).json({ message: 'Observation not found' });

  const ai = obs.actionItems.find((a) => a.id === req.params.aiId);
  if (!ai) return res.status(404).json({ message: 'Action item not found' });

  if (ai.status === 'Closed') {
    return res.status(400).json({ message: 'Cannot add follow-up to a closed action item' });
  }

  const followUp = {
    id: uuidv4(),
    actionItemId: ai.id,
    date: new Date().toISOString().split('T')[0],
    remarks: req.body.remarks,
    addedBy: req.user.id,
    addedByName: req.user.name,
  };
  ai.followUps.push(followUp);
  res.status(201).json(followUp);
});

// ─── POST /api/observations/:id/action-items/:aiId/revise-date ───────────────
router.post('/:id/action-items/:aiId/revise-date', authenticate, (req, res) => {
  const obs = observations.find((o) => o.id === req.params.id);
  if (!obs) return res.status(404).json({ message: 'Observation not found' });

  const ai = obs.actionItems.find((a) => a.id === req.params.aiId);
  if (!ai) return res.status(404).json({ message: 'Action item not found' });

  if (ai.status === 'Closed') {
    return res.status(400).json({ message: 'Cannot revise date of a closed action item' });
  }
  if (!req.body.newDate || !req.body.reason) {
    return res.status(400).json({ message: 'newDate and reason are required' });
  }

  const revision = {
    id: uuidv4(),
    actionItemId: ai.id,
    previousDate: ai.currentTargetDate,
    newDate: req.body.newDate,
    reason: req.body.reason,
    revisedDate: new Date().toISOString().split('T')[0],
    revisedBy: req.user.id,
    revisedByName: req.user.name,
  };
  ai.targetDateRevisions.push(revision);
  ai.currentTargetDate = req.body.newDate;
  res.status(201).json(revision);
});

// ─── PATCH /api/observations/:id/action-items/:aiId ──────────────────────────
router.patch('/:id/action-items/:aiId', authenticate, (req, res) => {
  const obs = observations.find((o) => o.id === req.params.id);
  if (!obs) return res.status(404).json({ message: 'Observation not found' });

  const ai = obs.actionItems.find((a) => a.id === req.params.aiId);
  if (!ai) return res.status(404).json({ message: 'Action item not found' });

  const { actionTaken, status, managementComment, auditorConfirmationStatus, auditorConfirmationComment } = req.body;
  const userRole = req.user.role;

  if ((actionTaken !== undefined || status !== undefined || managementComment !== undefined)) {
    if (userRole !== 'Responsible Person' && userRole !== 'Audit Team') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (actionTaken !== undefined) ai.actionTaken = actionTaken;
    if (managementComment !== undefined) ai.managementComment = managementComment;
    if (status !== undefined && ['Not Due', 'Partially Open', 'Request Closure'].includes(status)) {
      ai.status = status;
    }
  }

  if (auditorConfirmationStatus !== undefined) {
    if (userRole !== 'Audit Team') return res.status(403).json({ message: 'Only Audit Team can confirm closure' });
    ai.auditorConfirmationStatus = auditorConfirmationStatus;
    ai.auditorConfirmationComment = auditorConfirmationComment ?? ai.auditorConfirmationComment;
    if (auditorConfirmationStatus === 'Confirmed') {
      ai.status = 'Closed';
      ai.closureDate = new Date().toISOString().split('T')[0];
    } else if (auditorConfirmationStatus === 'Rejected') {
      ai.status = 'Partially Open';
    }
    obs.overallStatus = computeOverallStatus(obs.actionItems);
  }

  res.json(ai);
});

module.exports = router;
