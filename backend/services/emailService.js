'use strict';

const nodemailer = require('nodemailer');

/**
 * Email Service for Audit CAR Portal
 * Sends automated reminder and escalation emails.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.company.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.portalUrl = process.env.PORTAL_URL || 'http://localhost:4200/audit-car';
    this.from = process.env.EMAIL_FROM || 'Audit CAR Portal <audit-car@company.com>';
  }

  /**
   * Template 1: Reminder 15 days before due date (T-15)
   */
  async sendT15Reminder(actionItem, observation) {
    const subject = `[Audit CAR] Reminder: Audit Observation Due in 15 Days — ${observation.observationId}`;
    const html = this._buildReminderHtml({
      greeting: 'Gentle Reminder with reference to the below audit observation:',
      rows: [this._buildObsRow(observation, actionItem)],
      footerNote: 'We request you to check the details on the portal and provide your response in timely manner. This is system generated email and hence do not respond to this message.',
      type: 'T-15',
    });

    return this._send({ to: actionItem.responsiblePersonEmail, subject, html });
  }

  /**
   * Template 2: Reminder on due date (T-0)
   */
  async sendT0Reminder(actionItem, observation) {
    const subject = `[Audit CAR] URGENT: Audit Observation Due Today — ${observation.observationId}`;
    const html = this._buildReminderHtml({
      greeting: 'Gentle Reminder with reference to the below audit observation which is due for compliance today:',
      rows: [this._buildObsRow(observation, actionItem)],
      footerNote: 'We request you to check the details on the portal and provide your response in timely manner. Any delay in providing response to the audit observation will result in escalation to the HoD. This is system generated email and hence do not respond to this message.',
      type: 'T-0',
    });

    return this._send({ to: actionItem.responsiblePersonEmail, subject, html });
  }

  /**
   * Template 3: Monthly escalation on 25th — sent to responsible person AND HoD
   */
  async sendMonthlyEscalation(overdueItems, hodEmail) {
    const subject = `[Audit CAR] Monthly Overdue Audit Observations — ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    const rows = overdueItems.map(({ actionItem, observation }) =>
      this._buildEscalationRow(observation, actionItem)
    );
    const html = this._buildEscalationHtml({ rows });

    // Send to each responsible person and HoD
    const recipientEmails = [
      ...new Set(overdueItems.map((i) => i.actionItem.responsiblePersonEmail)),
      hodEmail,
    ].filter(Boolean);

    const sends = recipientEmails.map((email) =>
      this._send({ to: email, subject, html })
    );
    return Promise.allSettled(sends);
  }

  /**
   * Notification when observation is published (initial assignment email)
   */
  async sendAssignmentNotification(actionItem, observation) {
    const subject = `[Audit CAR] New Audit Observation Assigned — ${observation.observationId}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;">
        <div style="background:#3a3a8c;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;font-size:18px;">Audit CAR Portal — New Assignment</h2>
        </div>
        <div style="padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
          <p>Dear ${actionItem.responsiblePersonName},</p>
          <p>You have been assigned a new audit observation requiring your attention and corrective action.</p>
          ${this._buildObsTable([this._buildObsRow(observation, actionItem)])}
          <p><strong>Target Date:</strong> ${actionItem.initialTargetDate}</p>
          <p>Please log in to the portal to review the details and update your action plan.</p>
          <a href="${this.portalUrl}/observations/detail/${observation.id}"
             style="background:#3a3a8c;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;display:inline-block;margin-top:8px;">
            View Observation
          </a>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
          <p style="color:#888;font-size:12px;">This is a system generated email. Please do not reply.</p>
        </div>
      </div>`;
    return this._send({ to: actionItem.responsiblePersonEmail, subject, html });
  }

  _buildReminderHtml({ greeting, rows, footerNote, type }) {
    const headerColor = type === 'T-0' ? '#c0392b' : '#2980b9';
    return `
      <div style="font-family:Arial,sans-serif;max-width:750px;margin:auto;">
        <div style="background:${headerColor};color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;font-size:18px;">Audit CAR Portal — ${type === 'T-0' ? 'Due Today Reminder' : '15-Day Reminder'}</h2>
        </div>
        <div style="padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
          <p>Dear Sir/Madam,</p>
          <p>${greeting}</p>
          ${this._buildObsTable(rows)}
          <p style="margin-top:16px;">${footerNote}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
          <p style="color:#888;font-size:12px;">This is a system generated email. Please do not respond to this message.</p>
        </div>
      </div>`;
  }

  _buildEscalationHtml({ rows }) {
    return `
      <div style="font-family:Arial,sans-serif;max-width:850px;margin:auto;">
        <div style="background:#c0392b;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;font-size:18px;">Audit CAR Portal — Monthly Overdue Escalation</h2>
        </div>
        <div style="padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px;">
          <p>Dear Sir/Madam,</p>
          <p>Gentle Reminder with reference to the below audit observation(s) which are overdue for compliance:</p>
          ${this._buildEscalationTable(rows)}
          <p style="margin-top:16px;">We request you to check the details on the portal and provide your response in timely manner. All overdue open audit observations will be presented to the management in monthly meetings.</p>
          <p><strong>Note:</strong> This is a system generated email and hence do not respond to this message.</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
          <p style="color:#888;font-size:12px;">Audit CAR Portal — Automated Monthly Reminder</p>
        </div>
      </div>`;
  }

  _buildObsTable(rows) {
    const headers = ['Audit Area', 'Observation', 'Details of Findings', 'Management Commitment', 'Latest Target Date', 'Portal Link'];
    return `
      <table style="border-collapse:collapse;width:100%;font-size:13px;">
        <thead><tr>${headers.map((h) => `<th style="background:#f0f0f0;padding:8px;border:1px solid #ccc;text-align:left;">${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>`;
  }

  _buildEscalationTable(rows) {
    const headers = ['Audit Area', 'Observation', 'Details of Findings', 'Management Commitment', 'Initial Target Date', 'Responsible Person', 'Latest Target Date', 'Portal Link'];
    return `
      <table style="border-collapse:collapse;width:100%;font-size:13px;">
        <thead><tr>${headers.map((h) => `<th style="background:#ffe0e0;padding:8px;border:1px solid #ccc;text-align:left;">${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>`;
  }

  _buildObsRow(obs, ai) {
    const link = `<a href="${this.portalUrl}/observations/detail/${obs.id}">View</a>`;
    return `<tr>
      <td style="padding:8px;border:1px solid #ccc;">${obs.auditArea}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.observation}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.detailsOfFindings}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.managementCommitment}</td>
      <td style="padding:8px;border:1px solid #ccc;color:#c0392b;font-weight:bold;">${ai.currentTargetDate}</td>
      <td style="padding:8px;border:1px solid #ccc;">${link}</td>
    </tr>`;
  }

  _buildEscalationRow(obs, ai) {
    const link = `<a href="${this.portalUrl}/observations/detail/${obs.id}">View</a>`;
    return `<tr style="background:#fff8f8;">
      <td style="padding:8px;border:1px solid #ccc;">${obs.auditArea}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.observation}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.detailsOfFindings}</td>
      <td style="padding:8px;border:1px solid #ccc;">${obs.managementCommitment}</td>
      <td style="padding:8px;border:1px solid #ccc;">${ai.initialTargetDate}</td>
      <td style="padding:8px;border:1px solid #ccc;color:#c0392b;font-weight:bold;">${ai.responsiblePersonName}</td>
      <td style="padding:8px;border:1px solid #ccc;color:#c0392b;font-weight:bold;">${ai.currentTargetDate}</td>
      <td style="padding:8px;border:1px solid #ccc;">${link}</td>
    </tr>`;
  }

  async _send({ to, subject, html }) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EmailService] MOCK SEND → ${to} | Subject: ${subject}`);
      return { messageId: `mock-${Date.now()}` };
    }
    return this.transporter.sendMail({ from: this.from, to, subject, html });
  }
}

module.exports = new EmailService();
