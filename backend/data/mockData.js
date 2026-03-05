'use strict';

/**
 * In-memory data store for Audit CAR Portal.
 * In production, replace with a real database (PostgreSQL / MySQL / MongoDB).
 */

const { v4: uuidv4 } = require('uuid');

// ─── Users ────────────────────────────────────────────────────────────────────
const users = [
  {
    id: 'AUD001', name: 'Ravi Kumar', email: 'ravi.kumar@xyz.com',
    employeeId: 'EMP-AUD-001', role: 'Audit Team',
    division: 'Internal Audit', department: 'Internal Audit',
    passwordHash: '$2a$10$examplehash1', // bcrypt hash of 'password123'
  },
  {
    id: 'AUD002', name: 'Priya Nair', email: 'priya.nair@xyz.com',
    employeeId: 'EMP-AUD-002', role: 'Audit Team',
    division: 'Internal Audit', department: 'Internal Audit',
    passwordHash: '$2a$10$examplehash2',
  },
  {
    id: 'HOD001', name: 'Sanjay Gupta', email: 'sanjay.gupta@xyz.com',
    employeeId: 'EMP-HOD-001', role: 'HoD',
    division: 'Supply Chain', department: 'Supply Chain Management',
    passwordHash: '$2a$10$examplehash3',
  },
  {
    id: 'HOD002', name: 'Lakshmi Devi', email: 'lakshmi.devi@xyz.com',
    employeeId: 'EMP-HOD-002', role: 'HoD',
    division: 'Finance & Accounts', department: 'Finance',
    passwordHash: '$2a$10$examplehash4',
  },
  {
    id: 'EMP101', name: 'Anjali Sharma', email: 'anjali.sharma@xyz.com',
    employeeId: 'EMP-101', role: 'Responsible Person',
    division: 'Supply Chain', department: 'Procurement', hodId: 'HOD001',
    passwordHash: '$2a$10$examplehash5',
  },
  {
    id: 'EMP103', name: 'Meena Pillai', email: 'meena.pillai@xyz.com',
    employeeId: 'EMP-103', role: 'Responsible Person',
    division: 'Finance & Accounts', department: 'Finance', hodId: 'HOD002',
    passwordHash: '$2a$10$examplehash6',
  },
];

// ─── Observations ─────────────────────────────────────────────────────────────
const observations = [
  {
    id: '1',
    observationId: 'OBS-2024-001',
    auditYear: 2024,
    auditArea: 'Procurement',
    division: 'Supply Chain',
    riskRating: 'High',
    observation: 'Vendor due diligence not performed for 3 new suppliers',
    detailsOfFindings: 'During audit of procurement processes for Q1 2024, vendor due diligence checks were not conducted for 3 new suppliers.',
    managementCommitment: 'Procurement team will implement a mandatory vendor due diligence checklist.',
    auditorClosureComment: null,
    overallStatus: 'Open',
    createdBy: 'AUD001',
    createdByName: 'Ravi Kumar',
    createdDate: '2024-02-15',
    publishedDate: '2024-02-16',
    isPublished: true,
    actionItems: [
      {
        id: 'AI-001-01',
        observationId: 'OBS-2024-001',
        responsiblePersonId: 'EMP101',
        responsiblePersonName: 'Anjali Sharma',
        responsiblePersonEmail: 'anjali.sharma@xyz.com',
        department: 'Procurement',
        division: 'Supply Chain',
        initialTargetDate: '2024-03-31',
        currentTargetDate: '2024-04-30',
        status: 'Overdue',
        actionTaken: 'Drafted vendor due diligence checklist, pending approval.',
        managementComment: 'Legal team review in progress.',
        auditorConfirmationStatus: 'Pending',
        auditorConfirmationComment: null,
        closureDate: null,
        followUps: [
          {
            id: 'FU-001-01-1', actionItemId: 'AI-001-01',
            date: '2024-03-15', remarks: 'Checklist drafted and shared with legal.',
            addedBy: 'EMP101', addedByName: 'Anjali Sharma',
          },
        ],
        targetDateRevisions: [
          {
            id: 'TDR-001-01-1', actionItemId: 'AI-001-01',
            previousDate: '2024-03-31', newDate: '2024-04-30',
            reason: 'Legal review took longer.', revisedDate: '2024-03-28',
            revisedBy: 'EMP101', revisedByName: 'Anjali Sharma',
          },
        ],
      },
    ],
  },
];

// ─── Upload History ────────────────────────────────────────────────────────────
const uploadHistory = [
  {
    id: 'UH001', fileName: 'Audit_Observations_Q1_2024.xlsx',
    uploadDate: '2024-02-16', uploadedBy: 'AUD001', uploadedByName: 'Ravi Kumar',
    recordsUploaded: 8, status: 'Success', errors: [],
  },
];

// ─── Notification Log ──────────────────────────────────────────────────────────
const notificationLog = [];

module.exports = { users, observations, uploadHistory, notificationLog };
