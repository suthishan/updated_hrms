import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import {
  PackagingDocument,
  PackagingApprover,
  PackagingAuditTrail,
  PackagingApprovalStep,
  PackagingStepApprover,
  PackagingFile,
  PackagingDocStatus,
  PackagingApproverStatus,
} from '../../../../core/models/models';

// ---------------------------------------------------------------------------
// API configuration — matches backend-intranet/app.js mount point
// ---------------------------------------------------------------------------
const API_BASE  = 'http://localhost:3000/api';
const PKG_API   = `${API_BASE}/packaging`;

/** Generic backend envelope */
interface ApiResponse<T> {
  sts: '1' | '0';
  message: string;
  result?: T;
  total?: number;
}

// ---------------------------------------------------------------------------
// Raw shapes returned by PostgreSQL JOINs (snake_case)
// ---------------------------------------------------------------------------
interface RawApproval {
  approval_level:        number;
  approver_uuid:         string;
  approver_name:         string;
  decision:              string;
  remarks:               string | null;
  action_date:           string | null;
}

interface RawFile {
  id:         string;
  name:       string;
  type:       string;
  size:       number;
  url:        string;
  uploadedAt: string;
}

interface RawRequest {
  request_id:          number;
  emp_id:              string;
  requester_name:      string;
  department:          string;
  status:              string;
  priority:            string;
  form_data:           PackagingFormData;
  created_at:          string;
  updated_at:          string;
  submitted_at:        string | null;
  emp_designation:     string;
  emp_code:            string;
  files:               RawFile[];
  approvals:           RawApproval[];
  current_req_approval: RawApproval | null;
}

interface PackagingFormData {
  title?:           string;
  productName?:     string;
  productCategory?: string;
  batchRef?:        string;
  description?:     string;
  workflowType?:    'sequential' | 'parallel' | 'hybrid';
  workflowSteps?:   RawWorkflowStep[];
}

interface RawWorkflowStep {
  stepNumber: number;
  stepType:   'sequential' | 'parallel';
  approvers:  { emp_uuid: string; name: string; role?: string; email?: string }[];
}

interface RawApprover {
  id:              string;
  emp_uuid:        string;
  emp_name:        string;
  emp_email:       string;
  emp_designation: string;
  department:      string;
  location:        string;
  phone:           string;
  role_key:        string;
}

interface RawAuditLog {
  id:             number;
  action:         string;
  entity_type:    string;
  entity_id:      string | number;
  new_value:      string | null;
  old_value:      string | null;
  created_at:     string;
  emp_name:       string;
  emp_uuid:       string;
  request_id:     number | null;
  requester_name: string | null;
}

export interface DashboardStats {
  totalRequests: number;
  draft:         number;
  pending:       number;
  inReview:      number;
  approved:      number;
  rejected:      number;
}

export interface SubmitPayload {
  requestId:   number;
  title:       string;
  productName: string;
  productCategory: string;
  batchRef:    string;
  description: string;
  workflowType: 'sequential' | 'parallel' | 'hybrid';
  workflowSteps: {
    stepNumber: number;
    stepType:   'sequential' | 'parallel';
    approvers:  { emp_uuid: string; name: string; email?: string; role?: string }[];
  }[];
}

// ---------------------------------------------------------------------------
// Status + step mapping helpers
// ---------------------------------------------------------------------------

function mapStatus(backendStatus: string): PackagingDocStatus {
  if (!backendStatus) return 'draft';
  if (backendStatus === 'DRAFT')    return 'draft';
  if (backendStatus === 'SUBMITTED') return 'pending';
  if (backendStatus === 'APPROVED') return 'approved';
  if (backendStatus.endsWith('_REJECTED')) return 'rejected';
  if (backendStatus.match(/^L\d+_APPROVED$/)) return 'in-review';
  return 'draft';
}

function mapApproverDecision(decision: string): PackagingApproverStatus {
  if (decision === 'APPROVED') return 'approved';
  if (decision === 'REJECTED') return 'rejected';
  return 'pending';
}

function buildApprovalSteps(approvals: RawApproval[], formData: PackagingFormData): PackagingApprovalStep[] {
  if (!approvals || approvals.length === 0) return [];

  // Group by approval_level — each level = one step
  const levelMap = new Map<number, RawApproval[]>();
  for (const a of approvals) {
    if (!levelMap.has(a.approval_level)) levelMap.set(a.approval_level, []);
    levelMap.get(a.approval_level)!.push(a);
  }

  // Determine stepType from stored workflowSteps if available
  const stepTypeMap = new Map<number, 'sequential' | 'parallel'>();
  (formData?.workflowSteps || []).forEach(ws => {
    stepTypeMap.set(ws.stepNumber, ws.stepType);
  });

  const steps: PackagingApprovalStep[] = [];
  const sortedLevels = Array.from(levelMap.keys()).sort((a, b) => a - b);

  for (const level of sortedLevels) {
    const levelApprovals = levelMap.get(level)!;
    const stepApprovers: PackagingStepApprover[] = levelApprovals.map(a => ({
      approverId:    a.approver_uuid,
      approverName:  a.approver_name,
      approverEmail: '',
      role:          a.approver_name,
      status:        mapApproverDecision(a.decision),
      remarks:       a.remarks ?? null,
      actionAt:      a.action_date ?? null,
    }));

    const allApproved  = stepApprovers.every(a => a.status === 'approved');
    const anyRejected  = stepApprovers.some(a => a.status === 'rejected');
    const anyPending   = stepApprovers.some(a => a.status === 'pending');

    let stepStatus: 'pending' | 'in-progress' | 'completed' | 'rejected';
    if (anyRejected)          stepStatus = 'rejected';
    else if (allApproved)     stepStatus = 'completed';
    else if (anyPending)      stepStatus = 'in-progress';
    else                      stepStatus = 'pending';

    steps.push({
      id:        `step-${level}`,
      stepNumber: level,
      stepType:  stepTypeMap.get(level) ?? 'sequential',
      status:    stepStatus,
      completedAt: allApproved ? (levelApprovals.find(a => a.action_date)?.action_date ?? undefined) : undefined,
      approvers: stepApprovers,
    });
  }
  return steps;
}

function computeCurrentStepIndex(steps: PackagingApprovalStep[]): number {
  const idx = steps.findIndex(s => s.status === 'in-progress' || s.status === 'pending');
  return idx >= 0 ? idx : Math.max(0, steps.length - 1);
}

function mapRawRequest(r: RawRequest): PackagingDocument {
  const fd        = r.form_data || {};
  const steps     = buildApprovalSteps(r.approvals || [], fd);
  const files: PackagingFile[] = (r.files || []).map(f => ({
    id:         String(f.id),
    name:       f.name,
    type:       (f.type === 'pdf' ? 'pdf' : 'jpeg') as 'pdf' | 'jpeg',
    size:       f.size,
    url:        `http://localhost:3000/${f.url}`,
    uploadedAt: f.uploadedAt,
  }));

  return {
    id:              String(r.request_id),
    title:           fd.title           ?? `Request #${r.request_id}`,
    description:     fd.description     ?? '',
    productName:     fd.productName     ?? '',
    productCategory: fd.productCategory ?? '',
    batchRef:        fd.batchRef        ?? '',
    files,
    workflowType:    fd.workflowType    ?? 'sequential',
    status:          mapStatus(r.status),
    initiator:       r.requester_name,
    initiatorEmail:  '',
    createdAt:       r.created_at,
    updatedAt:       r.updated_at,
    currentStepIndex: computeCurrentStepIndex(steps),
    approvalSteps:   steps,
  };
}

function mapRawApprover(r: RawApprover): PackagingApprover {
  return {
    id:         r.emp_uuid,
    name:       r.emp_name,
    role:       r.emp_designation || r.role_key,
    roleKey:    r.role_key,
    email:      r.emp_email,
    department: r.department,
    location:   r.location,
    phone:      r.phone,
    isActive:   true,
  };
}

function mapRawAuditLog(r: RawAuditLog, index: number): PackagingAuditTrail {
  const actionLabel = (r.action || '').replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());
  let actionType: 'uploaded' | 'submitted' | 'approved' | 'rejected' | 'pending' = 'pending';
  const a = r.action || '';
  if (a.includes('UPLOAD'))    actionType = 'uploaded';
  else if (a.includes('SUBMIT')) actionType = 'submitted';
  else if (a.includes('APPROVED')) actionType = 'approved';
  else if (a.includes('REJECTED')) actionType = 'rejected';

  return {
    id:               String(r.id),
    documentId:       r.entity_id != null ? String(r.entity_id) : String(r.request_id ?? ''),
    documentTitle:    r.requester_name ?? actionLabel,
    action:           actionLabel,
    actionType,
    performedBy:      r.emp_name ?? '',
    performedByEmail: '',
    timestamp:        r.created_at,
    remarks:          r.new_value ?? undefined,
    status:           actionType,
    sNo:              index + 1,
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class PackagingService {

  constructor(private http: HttpClient) {}

  // ---- Auth header from localStorage (same pattern as the intranet app) ----
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ---- Approver pool (no auth required) ------------------------------------
  getApprovers(search = ''): Observable<PackagingApprover[]> {
    const url = search ? `${PKG_API}/approvers?search=${encodeURIComponent(search)}` : `${PKG_API}/approvers`;
    return this.http.get<ApiResponse<RawApprover[]>>(url).pipe(
      map(r => (r.result ?? []).map(mapRawApprover)),
      catchError(this._handleError)
    );
  }

  // ---- Draft + upload ------------------------------------------------------
  createDraft(payload: {
    emp_uuid: string;
    requester_name: string;
    department: string;
    priority?: string;
  }): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(
      `${PKG_API}/create-draft`, payload,
      { headers: this.authHeaders() }
    ).pipe(
      map(r => { if (r.sts !== '1') throw new Error(r.message); return r.result!; }),
      catchError(this._handleError)
    );
  }

  uploadFiles(requestId: number, files: File[]): Observable<PackagingFile[]> {
    const fd = new FormData();
    fd.append('request_id', String(requestId));
    files.forEach(f => fd.append('files', f));
    return this.http.post<ApiResponse<{ id: string; file_name: string; file_type: string; file_size: number; file_url: string; uploaded_at: string }[]>>(
      `${PKG_API}/upload-files`, fd,
      { headers: this.authHeaders().delete('Content-Type') }
    ).pipe(
      map(r => {
        if (r.sts !== '1') throw new Error(r.message);
        return (r.result ?? []).map(f => ({
          id:         f.id,
          name:       f.file_name,
          type:       (f.file_type === 'pdf' ? 'pdf' : 'jpeg') as 'pdf' | 'jpeg',
          size:       f.file_size,
          url:        `http://localhost:3000/${f.file_url}`,
          uploadedAt: f.uploaded_at,
        }));
      }),
      catchError(this._handleError)
    );
  }

  // ---- Submit for approval -------------------------------------------------
  submitRequest(payload: SubmitPayload): Observable<PackagingDocument> {
    const body = {
      request_id: payload.requestId,
      form_data: {
        title:           payload.title,
        productName:     payload.productName,
        productCategory: payload.productCategory,
        batchRef:        payload.batchRef,
        description:     payload.description,
        workflowType:    payload.workflowType,
        workflowSteps:   payload.workflowSteps,
      },
    };
    return this.http.post<ApiResponse<RawRequest>>(
      `${PKG_API}/submit`, body,
      { headers: this.authHeaders() }
    ).pipe(
      map(r => { if (r.sts !== '1') throw new Error(r.message); return mapRawRequest(r.result!); }),
      catchError(this._handleError)
    );
  }

  // ---- List requests -------------------------------------------------------
  getRequests(empUuid: string, role: 'REQUESTER' | 'APPROVER' | 'ADMIN', size = 50): Observable<PackagingDocument[]> {
    return this.http.post<ApiResponse<RawRequest[]>>(
      `${PKG_API}/get-requests`,
      { emp_uuid: empUuid, emp_role: role, size },
      { headers: this.authHeaders() }
    ).pipe(
      map(r => (r.result ?? []).map(mapRawRequest)),
      catchError(this._handleError)
    );
  }

  // ---- Single request detail -----------------------------------------------
  getRequestById(requestId: string | number): Observable<PackagingDocument> {
    return this.http.post<ApiResponse<RawRequest>>(
      `${PKG_API}/get-request-by-id`,
      { request_id: Number(requestId) },
      { headers: this.authHeaders() }
    ).pipe(
      map(r => { if (r.sts !== '1') throw new Error(r.message); return mapRawRequest(r.result!); }),
      catchError(this._handleError)
    );
  }

  // ---- Approve / Reject ----------------------------------------------------
  approve(payload: {
    request_id: number;
    level: number;
    decision: 'APPROVED' | 'REJECTED';
    remarks?: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.http.post<ApiResponse<unknown>>(
      `${PKG_API}/approve`, payload,
      { headers: this.authHeaders() }
    ).pipe(
      map(r => ({ success: r.sts === '1', message: r.message })),
      catchError(this._handleError)
    );
  }

  // ---- Audit trail ---------------------------------------------------------
  getAuditTrail(requestId?: number): Observable<PackagingAuditTrail[]> {
    const url = requestId
      ? `${PKG_API}/audit-trail?request_id=${requestId}`
      : `${PKG_API}/audit-trail`;
    return this.http.get<ApiResponse<RawAuditLog[]>>(url, { headers: this.authHeaders() }).pipe(
      map(r => (r.result ?? []).map((log, i) => mapRawAuditLog(log, i))),
      catchError(this._handleError)
    );
  }

  // ---- Dashboard stats -----------------------------------------------------
  getDashboardStats(empUuid: string, role: 'REQUESTER' | 'APPROVER' | 'ADMIN'): Observable<DashboardStats> {
    return this.http.post<ApiResponse<{
      total_requests: string; draft: string; pending: string;
      in_review: string; approved: string; rejected: string;
    }>>(
      `${PKG_API}/dashboard-stats`,
      { emp_uuid: empUuid, emp_role: role },
      { headers: this.authHeaders() }
    ).pipe(
      map(r => {
        const s = r.result ?? { total_requests: '0', draft: '0', pending: '0', in_review: '0', approved: '0', rejected: '0' };
        return {
          totalRequests: Number(s.total_requests),
          draft:         Number(s.draft),
          pending:       Number(s.pending),
          inReview:      Number(s.in_review),
          approved:      Number(s.approved),
          rejected:      Number(s.rejected),
        };
      }),
      catchError(this._handleError)
    );
  }

  // ---- Private error handler -----------------------------------------------
  private _handleError(err: unknown) {
    const msg = (err instanceof Error) ? err.message : 'Packaging API error';
    console.error('[PackagingService]', err);
    return throwError(() => new Error(msg));
  }
}
