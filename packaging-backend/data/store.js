/**
 * In-memory data store for the Packaging Approval Portal.
 * In production, replace this with a real database (PostgreSQL / MongoDB).
 */

const { v4: uuidv4 } = require('uuid');

// ─── Approvers Master List ────────────────────────────────────────────────────
const APPROVERS = [
  { id: 'APR001', name: 'Rajesh Kumar',  role: 'Head of Quality',     roleKey: 'head_quality',      email: 'rajesh.kumar@company.com',   department: 'Quality Assurance',  location: 'Supa',        phone: '+91 98765 43210', isActive: true },
  { id: 'APR002', name: 'Priya Sharma',  role: 'Head of Nutrition',   roleKey: 'head_nutrition',    email: 'priya.sharma@company.com',   department: 'Nutrition',          location: 'KGP',         phone: '+91 98765 43211', isActive: true },
  { id: 'APR003', name: 'Suresh Patel',  role: 'Head of Production',  roleKey: 'head_production',   email: 'suresh.patel@company.com',   department: 'Production',         location: 'Supa',        phone: '+91 98765 43212', isActive: true },
  { id: 'APR004', name: 'Anita Verma',   role: 'Head of Sales',       roleKey: 'head_sales',        email: 'anita.verma@company.com',    department: 'Sales',              location: 'Bhubaneswar', phone: '+91 98765 43213', isActive: true },
  { id: 'APR005', name: 'Vikram Singh',  role: 'Business Head',       roleKey: 'business_head',     email: 'vikram.singh@company.com',   department: 'Business',           location: 'KGP',         phone: '+91 98765 43214', isActive: true },
  { id: 'APR006', name: 'Meera Nair',    role: 'Compliance Head',     roleKey: 'compliance_head',   email: 'meera.nair@company.com',     department: 'Compliance & Legal', location: 'Supa',        phone: '+91 98765 43215', isActive: true },
  { id: 'APR007', name: 'Deepak Joshi',  role: 'Purchase Head',       roleKey: 'purchase_head',     email: 'deepak.joshi@company.com',   department: 'Procurement',        location: 'Bhubaneswar', phone: '+91 98765 43216', isActive: true },
  { id: 'APR008', name: 'Ravi Mehta',    role: 'Managing Director',   roleKey: 'managing_director', email: 'ravi.mehta@company.com',     department: 'Executive',          location: 'KGP',         phone: '+91 98765 43217', isActive: true },
];

// ─── In-memory documents store ────────────────────────────────────────────────
let documents = [];

// ─── In-memory audit trail ────────────────────────────────────────────────────
let auditTrail = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function addAuditEntry({ documentId, documentTitle, action, actionType, performedBy, performedByEmail, remarks }) {
  auditTrail.push({
    id: `AUD${uuidv4().slice(0, 8).toUpperCase()}`,
    documentId,
    documentTitle,
    action,
    actionType,
    performedBy,
    performedByEmail,
    timestamp: new Date().toISOString(),
    remarks: remarks || null,
    status: actionType
  });
}

module.exports = { APPROVERS, documents, auditTrail, addAuditEntry, uuidv4 };
