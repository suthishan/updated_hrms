const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
const { documents, APPROVERS, auditTrail, addAuditEntry, uuidv4 } = require('../data/store');

// ─── GET /api/documents ───────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { status, workflow, initiatorEmail, search } = req.query;
  let result = [...documents];

  if (status) result = result.filter(d => d.status === status);
  if (workflow) result = result.filter(d => d.workflowType === workflow);
  if (initiatorEmail) result = result.filter(d => d.initiatorEmail === initiatorEmail);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.productName.toLowerCase().includes(q) ||
      d.batchRef.toLowerCase().includes(q) ||
      d.initiator.toLowerCase().includes(q)
    );
  }

  res.json({ totalData: result.length, data: result });
});

// ─── GET /api/documents/:id ───────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found.' });
  res.json(doc);
});

// ─── POST /api/documents ──────────────────────────────────────────────────────
// Multipart: uploads files + JSON body fields
router.post('/', upload.array('files', 10), (req, res) => {
  const { title, productName, productCategory, batchRef, description, initiator, initiatorEmail } = req.body;

  if (!title || !productName || !batchRef || !initiator || !initiatorEmail) {
    return res.status(400).json({ message: 'Missing required fields: title, productName, batchRef, initiator, initiatorEmail.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'At least one file (PDF or JPEG) must be uploaded.' });
  }

  const packagingFiles = req.files.map(f => ({
    id: `F${uuidv4().slice(0, 8)}`,
    name: f.originalname,
    type: f.mimetype === 'application/pdf' ? 'pdf' : 'jpeg',
    size: f.size,
    url: `/uploads/${f.filename}`,
    storedAs: f.filename,
    uploadedAt: new Date().toISOString()
  }));

  const newDoc = {
    id: `PKG${uuidv4().slice(0, 8).toUpperCase()}`,
    title: title.trim(),
    description: description?.trim() || '',
    productName: productName.trim(),
    productCategory: productCategory?.trim() || 'Other',
    batchRef: batchRef.trim(),
    files: packagingFiles,
    workflowType: 'sequential',   // updated via PATCH /configure
    status: 'draft',
    initiator: initiator.trim(),
    initiatorEmail: initiatorEmail.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStepIndex: 0,
    approvalSteps: []
  };

  documents.push(newDoc);

  addAuditEntry({
    documentId: newDoc.id,
    documentTitle: newDoc.title,
    action: 'Document Uploaded',
    actionType: 'uploaded',
    performedBy: initiator,
    performedByEmail: initiatorEmail,
    remarks: `Uploaded ${packagingFiles.length} file(s) for review.`
  });

  res.status(201).json({ message: 'Document created successfully.', data: newDoc });
});

// ─── PATCH /api/documents/:id/configure ──────────────────────────────────────
// Set workflow type and approval steps
router.patch('/:id/configure', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found.' });
  if (doc.status !== 'draft') return res.status(400).json({ message: 'Only draft documents can be configured.' });

  const { workflowType, steps, initiatorEmail } = req.body;
  const validWorkflows = ['sequential', 'parallel', 'hybrid'];
  if (!validWorkflows.includes(workflowType)) {
    return res.status(400).json({ message: `Invalid workflowType. Must be one of: ${validWorkflows.join(', ')}.` });
  }

  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({ message: 'At least one approval step is required.' });
  }

  // Validate each step
  for (const [i, step] of steps.entries()) {
    if (!step.approverIds || step.approverIds.length === 0) {
      return res.status(400).json({ message: `Step ${i + 1} must have at least one approver.` });
    }
    // Verify approver IDs exist
    for (const aid of step.approverIds) {
      if (!APPROVERS.find(a => a.id === aid)) {
        return res.status(400).json({ message: `Approver ID "${aid}" not found.` });
      }
    }
  }

  doc.workflowType = workflowType;
  doc.approvalSteps = steps.map((step, idx) => ({
    id: `STEP${uuidv4().slice(0, 8)}`,
    stepNumber: idx + 1,
    stepType: workflowType === 'parallel' ? 'parallel'
            : workflowType === 'sequential' ? 'sequential'
            : (step.stepType || 'sequential'),
    status: idx === 0 ? 'in-progress' : 'pending',
    approvers: step.approverIds.map(aid => {
      const a = APPROVERS.find(x => x.id === aid);
      return {
        approverId: a.id,
        approverName: a.name,
        approverEmail: a.email,
        role: a.role,
        status: 'pending',
        remarks: null,
        actionAt: null
      };
    })
  }));

  doc.status = 'pending';
  doc.currentStepIndex = 0;
  doc.updatedAt = new Date().toISOString();

  addAuditEntry({
    documentId: doc.id,
    documentTitle: doc.title,
    action: 'Workflow Configured & Submitted',
    actionType: 'submitted',
    performedBy: doc.initiator,
    performedByEmail: initiatorEmail || doc.initiatorEmail,
    remarks: `${workflowType} workflow with ${steps.length} step(s) configured. Document sent for review.`
  });

  res.json({ message: 'Workflow configured. Document submitted for approval.', data: doc });
});

// ─── PATCH /api/documents/:id/decide ─────────────────────────────────────────
// Approver takes action: approve or reject
router.patch('/:id/decide', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found.' });
  if (doc.status === 'approved' || doc.status === 'rejected') {
    return res.status(400).json({ message: 'This document has already been finalized.' });
  }

  const { approverId, decision, remarks } = req.body;
  if (!approverId || !['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ message: 'approverId and decision (approved|rejected) are required.' });
  }
  if (decision === 'rejected' && !remarks?.trim()) {
    return res.status(400).json({ message: 'Remarks are required when rejecting a document.' });
  }

  const currentStep = doc.approvalSteps[doc.currentStepIndex];
  if (!currentStep) return res.status(400).json({ message: 'No active approval step found.' });

  const stepApprover = currentStep.approvers.find(a => a.approverId === approverId && a.status === 'pending');
  if (!stepApprover) {
    return res.status(403).json({ message: 'You are not a pending approver on the current step.' });
  }

  const approverInfo = APPROVERS.find(a => a.id === approverId);
  const performedBy = approverInfo?.name || approverId;
  const performedByEmail = approverInfo?.email || '';

  // Update approver status
  stepApprover.status = decision;
  stepApprover.remarks = remarks?.trim() || null;
  stepApprover.actionAt = new Date().toISOString();

  addAuditEntry({
    documentId: doc.id,
    documentTitle: doc.title,
    action: `${decision === 'approved' ? 'Approved' : 'Rejected'} by ${approverInfo?.role || approverId}`,
    actionType: decision,
    performedBy,
    performedByEmail,
    remarks: remarks?.trim() || null
  });

  if (decision === 'rejected') {
    // Reject the whole document
    currentStep.status = 'rejected';
    doc.status = 'rejected';
    doc.updatedAt = new Date().toISOString();
    return res.json({ message: 'Document rejected. Initiator will be notified.', data: doc });
  }

  // Approved — check if all approvers in parallel step are done
  const allApproved = currentStep.approvers.every(a => a.status === 'approved');
  if (allApproved) {
    currentStep.status = 'completed';
    currentStep.completedAt = new Date().toISOString();

    const nextIndex = doc.currentStepIndex + 1;
    if (nextIndex < doc.approvalSteps.length) {
      doc.currentStepIndex = nextIndex;
      doc.approvalSteps[nextIndex].status = 'in-progress';
      doc.status = 'in-review';
    } else {
      // All steps complete
      doc.status = 'approved';
    }
  }

  doc.updatedAt = new Date().toISOString();
  res.json({ message: `Step ${decision}. ${allApproved ? 'Moving to next step.' : 'Waiting for other approvers.'}`, data: doc });
});

// ─── GET /api/documents/:id/download ─────────────────────────────────────────
// Return file list for download (procurement use)
router.get('/:id/download-info', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found.' });
  if (doc.status !== 'approved') {
    return res.status(403).json({ message: 'Only approved documents can be downloaded.' });
  }
  res.json({
    id: doc.id,
    title: doc.title,
    status: doc.status,
    approvedAt: doc.updatedAt,
    files: doc.files.map(f => ({ name: f.name, url: f.url, type: f.type }))
  });
});

module.exports = router;
