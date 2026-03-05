import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import {
  AuditObservation,
  AuditEmployee,
  AuditBatch,
  AuditBatchSummary,
  AuditStagingRow,
  AuditDashboardStats,
  AuditRiskRating,
  AuditObservationStatus,
} from '../../../../core/models/models';

// Configure to point at the Node.js backend.
// In production use an Angular environment file or a reverse-proxy.
const API_BASE = 'http://localhost:3000/api';
const AUDIT_API = `${API_BASE}/audit`;
const MASTER_API = `${API_BASE}/master`;

/** Generic wrapper shape returned by every backend endpoint */
interface ApiResponse<T> {
  sts: '1' | '0';
  message: string;
  result?: T;
  total?: number;
}

/** Shape returned by POST /api/audit/list */
interface ObservationListResponse {
  sts: '1' | '0';
  message: string;
  result: RawObservation[];
  total: number;
}

/** Raw snake_case record from PostgreSQL JOIN */
interface RawObservation {
  observation_id: number;
  observation_number: string;
  audit_year: number;
  audit_area_id?: number;
  division_id?: number;
  observation_title: string;
  risk_rating: string;
  details_of_findings: string;
  followup_commitment: string;
  responsible_person_id?: number;
  initial_target_date: string;
  subsequent_followup_1?: string;
  updated_target_date_1?: string;
  status: string;
  closure_date?: string;
  closure_remarks?: string;
  closed_by_user_id?: number;
  created_by_user_id?: number;
  created_at: string;
  updated_at: string;
  audit_area?: string;
  division?: string;
  responsible_person?: string;
  responsible_person_code?: string;
  responsible_person_email?: string;
  closed_by?: string;
  created_by?: string;
}

function mapRaw(r: RawObservation): AuditObservation {
  return {
    observationId: r.observation_id,
    observationNumber: r.observation_number,
    auditYear: r.audit_year,
    auditAreaId: r.audit_area_id,
    divisionId: r.division_id,
    observationTitle: r.observation_title,
    riskRating: r.risk_rating as AuditRiskRating,
    detailsOfFindings: r.details_of_findings,
    followupCommitment: r.followup_commitment,
    responsiblePersonId: r.responsible_person_id,
    initialTargetDate: r.initial_target_date,
    subsequentFollowup1: r.subsequent_followup_1,
    updatedTargetDate1: r.updated_target_date_1,
    status: r.status as AuditObservationStatus,
    closureDate: r.closure_date,
    closureRemarks: r.closure_remarks,
    closedByUserId: r.closed_by_user_id,
    createdByUserId: r.created_by_user_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    auditArea: r.audit_area,
    division: r.division,
    responsiblePerson: r.responsible_person,
    responsiblePersonCode: r.responsible_person_code,
    responsiblePersonEmail: r.responsible_person_email,
    closedBy: r.closed_by,
    createdBy: r.created_by,
  };
}

export interface ObservationFilters {
  audit_year?: number;
  status?: string;
  risk_rating?: string;
  division_id?: number;
  audit_area_id?: number;
  limit?: number;
  offset?: number;
}

export interface ObservationPage {
  rows: AuditObservation[];
  total: number;
}

interface RawStagingRow {
  staging_id: number;
  batch_id: string;
  upload_filename: string;
  audit_year: string;
  audit_area: string;
  division: string;
  observation_title: string;
  risk_rating: string;
  details_of_findings: string;
  followup_commitment: string;
  responsible_person: string;
  initial_target_date: string;
  subsequent_followup_1: string;
  updated_target_date_1: string;
  status: string;
  sync_status: 'Pending' | 'Synced' | 'Error';
  sync_error?: string;
  synced_observation_id?: number;
}

function mapStagingRow(r: RawStagingRow): AuditStagingRow {
  return {
    stagingId: r.staging_id,
    batchId: r.batch_id,
    uploadFilename: r.upload_filename,
    auditYear: r.audit_year,
    auditArea: r.audit_area,
    division: r.division,
    observationTitle: r.observation_title,
    riskRating: r.risk_rating,
    detailsOfFindings: r.details_of_findings,
    followupCommitment: r.followup_commitment,
    responsiblePerson: r.responsible_person,
    initialTargetDate: r.initial_target_date,
    subsequentFollowup1: r.subsequent_followup_1,
    updatedTargetDate1: r.updated_target_date_1,
    status: r.status,
    syncStatus: r.sync_status,
    syncError: r.sync_error,
    syncedObservationId: r.synced_observation_id,
  };
}

@Injectable({ providedIn: 'root' })
export class AuditCarService {
  constructor(private http: HttpClient) {}

  // ─── Observations ────────────────────────────────────────────────────────

  /** POST /api/audit/list */
  getObservations(filters: ObservationFilters = {}): Observable<ObservationPage> {
    return this.http
      .post<ObservationListResponse>(`${AUDIT_API}/list`, { limit: 20, offset: 0, ...filters })
      .pipe(map((res) => ({ rows: (res.result ?? []).map(mapRaw), total: res.total ?? 0 })));
  }

  /** POST /api/audit/detail */
  getObservationById(observationId: number): Observable<AuditObservation | null> {
    return this.http
      .post<ApiResponse<RawObservation>>(`${AUDIT_API}/detail`, { observation_id: observationId })
      .pipe(map((res) => (res.result ? mapRaw(res.result as unknown as RawObservation) : null)));
  }

  /** POST /api/audit/create */
  createObservation(payload: {
    audit_year: number;
    audit_area_id?: number;
    division_id?: number;
    observation_title: string;
    risk_rating: string;
    details_of_findings: string;
    followup_commitment: string;
    responsible_person_id: number;
    initial_target_date: string;
    subsequent_followup_1?: string;
    updated_target_date_1?: string;
    status?: string;
  }): Observable<AuditObservation> {
    return this.http
      .post<ApiResponse<RawObservation>>(`${AUDIT_API}/create`, payload)
      .pipe(
        map((res) => {
          if (res.sts !== '1' || !res.result) throw new Error(res.message);
          return mapRaw(res.result as unknown as RawObservation);
        })
      );
  }

  /** POST /api/audit/update */
  updateObservation(
    observationId: number,
    fields: Partial<{
      audit_area_id: number;
      division_id: number;
      observation_title: string;
      risk_rating: string;
      details_of_findings: string;
      followup_commitment: string;
      responsible_person_id: number;
      initial_target_date: string;
      subsequent_followup_1: string;
      updated_target_date_1: string;
      status: string;
    }>
  ): Observable<AuditObservation> {
    return this.http
      .post<ApiResponse<RawObservation>>(`${AUDIT_API}/update`, { observation_id: observationId, ...fields })
      .pipe(
        map((res) => {
          if (res.sts !== '1' || !res.result) throw new Error(res.message);
          return mapRaw(res.result as unknown as RawObservation);
        })
      );
  }

  /** POST /api/audit/close */
  closeObservation(
    observationId: number,
    closureDate: string,
    closureRemarks: string
  ): Observable<AuditObservation> {
    return this.http
      .post<ApiResponse<RawObservation>>(`${AUDIT_API}/close`, {
        observation_id: observationId,
        closure_date: closureDate,
        closure_remarks: closureRemarks,
      })
      .pipe(
        map((res) => {
          if (res.sts !== '1' || !res.result) throw new Error(res.message);
          return mapRaw(res.result as unknown as RawObservation);
        })
      );
  }

  /** POST /api/audit/delete */
  deleteObservation(observationId: number): Observable<void> {
    return this.http
      .post<ApiResponse<unknown>>(`${AUDIT_API}/delete`, { observation_id: observationId })
      .pipe(
        map((res) => {
          if (res.sts !== '1') throw new Error(res.message);
        })
      );
  }

  // ─── Excel Upload / Staging ──────────────────────────────────────────────

  /** POST /api/audit/upload (multipart/form-data, field: 'file') */
  uploadExcel(file: File, uploadedByUserId = 1): Observable<{ batchId: string; totalRows: number }> {
    const form = new FormData();
    form.append('file', file);
    form.append('uploaded_by_user_id', String(uploadedByUserId));
    return this.http
      .post<ApiResponse<{ batch_id: string; total_rows: number }>>(`${AUDIT_API}/upload`, form)
      .pipe(
        map((res) => {
          if (res.sts !== '1' || !res.result) throw new Error(res.message);
          return { batchId: res.result.batch_id, totalRows: res.result.total_rows };
        }),
        catchError((err) =>
          throwError(() => new Error(err?.error?.message ?? err.message ?? 'Upload failed'))
        )
      );
  }

  /** GET /api/audit/staging/:batchId */
  getStagingRows(batchId: string): Observable<{ summary: AuditBatchSummary; rows: AuditStagingRow[] }> {
    return this.http
      .get<ApiResponse<{ summary: AuditBatchSummary; rows: RawStagingRow[] }>>(
        `${AUDIT_API}/staging/${batchId}`
      )
      .pipe(
        map((res) => {
          const data = res.result as { summary: AuditBatchSummary; rows: RawStagingRow[] };
          return { summary: data.summary, rows: (data.rows ?? []).map(mapStagingRow) };
        })
      );
  }

  /** POST /api/audit/sync/:batchId */
  syncBatch(batchId: string): Observable<{ synced: number; errors: number }> {
    return this.http
      .post<ApiResponse<{ synced: number; errors: number }>>(`${AUDIT_API}/sync/${batchId}`, {})
      .pipe(map((res) => res.result as { synced: number; errors: number }));
  }

  /** GET /api/audit/sync/status/:batchId */
  getSyncStatus(batchId: string): Observable<{ summary: AuditBatchSummary; error_rows?: unknown[] }> {
    return this.http
      .get<ApiResponse<{ summary: AuditBatchSummary; error_rows?: unknown[] }>>(
        `${AUDIT_API}/sync/status/${batchId}`
      )
      .pipe(map((res) => res.result as { summary: AuditBatchSummary; error_rows?: unknown[] }));
  }

  /** POST /api/audit/sync/retry/:batchId */
  retryBatch(batchId: string): Observable<{ synced: number; errors: number }> {
    return this.http
      .post<ApiResponse<{ synced: number; errors: number }>>(`${AUDIT_API}/sync/retry/${batchId}`, {})
      .pipe(map((res) => res.result as { synced: number; errors: number }));
  }

  /** GET /api/audit/batches */
  getBatches(): Observable<AuditBatch[]> {
    return this.http
      .get<ApiResponse<AuditBatch[]>>(`${AUDIT_API}/batches`)
      .pipe(map((res) => (res.result ?? []) as AuditBatch[]));
  }

  // ─── Master Lookups ──────────────────────────────────────────────────────

  /** POST /api/master/employees — typeahead search by partial name */
  searchEmployees(name: string): Observable<AuditEmployee[]> {
    return this.http
      .post<{ sts: string; result: AuditEmployee[] }>(`${MASTER_API}/employees`, { emp_name: name })
      .pipe(map((res) => res.result ?? []));
  }

  // ─── Dashboard (computed client-side) ────────────────────────────────────

  buildDashboardStats(obs: AuditObservation[]): AuditDashboardStats {
    const byDiv = new Map<string, { count: number; open: number; closed: number }>();
    const byYr = new Map<number, { total: number; open: number; closed: number }>();
    const byPerson = new Map<string, { total: number; open: number; closed: number; overdue: number }>();

    for (const o of obs) {
      const div = o.division ?? 'Unknown';
      const ds = byDiv.get(div) ?? { count: 0, open: 0, closed: 0 };
      ds.count++;
      if (o.status !== 'Closed') ds.open++;
      else ds.closed++;
      byDiv.set(div, ds);

      const ys = byYr.get(o.auditYear) ?? { total: 0, open: 0, closed: 0 };
      ys.total++;
      if (o.status !== 'Closed') ys.open++;
      else ys.closed++;
      byYr.set(o.auditYear, ys);

      const person = o.responsiblePerson ?? 'Unassigned';
      const ps = byPerson.get(person) ?? { total: 0, open: 0, closed: 0, overdue: 0 };
      ps.total++;
      if (o.status === 'Closed') ps.closed++;
      else ps.open++;
      if (o.status === 'Overdue') ps.overdue++;
      byPerson.set(person, ps);
    }

    return {
      totalObservations: obs.length,
      openObservations: obs.filter((o) => o.status === 'Open').length,
      closedObservations: obs.filter((o) => o.status === 'Closed').length,
      overdueObservations: obs.filter((o) => o.status === 'Overdue').length,
      repeatedObservations: obs.filter((o) => o.status === 'Repeated').length,
      byRiskRating: {
        high: obs.filter((o) => o.riskRating === 'High').length,
        medium: obs.filter((o) => o.riskRating === 'Medium').length,
        low: obs.filter((o) => o.riskRating === 'Low').length,
        improvement: obs.filter((o) => o.riskRating === 'Improvement').length,
      },
      byDivision: [...byDiv.entries()].map(([division, s]) => ({ division, ...s })),
      byYear: [...byYr.entries()]
        .map(([year, s]) => ({ year, ...s }))
        .sort((a, b) => b.year - a.year),
      responsiblePersonStats: [...byPerson.entries()].map(([name, s]) => ({ name, ...s })),
    };
  }

  // ─── UI Helpers ──────────────────────────────────────────────────────────

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      Open: 'badge-soft-danger',
      Overdue: 'badge-soft-danger',
      Repeated: 'badge-soft-warning',
      Closed: 'badge-soft-success',
    };
    return map[status] ?? 'badge-soft-secondary';
  }

  getRiskBadgeClass(rating: AuditRiskRating): string {
    const map: Record<AuditRiskRating, string> = {
      High: 'badge-soft-danger',
      Medium: 'badge-soft-warning',
      Low: 'badge-soft-info',
      Improvement: 'badge-soft-primary',
    };
    return map[rating];
  }

  getDaysRemaining(targetDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  getProgressWidth(value: number, total: number): string {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  }
}
