import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import {
  AuditObservation,
  AuditActionItem,
  AuditUser,
  AuditDashboardStats,
  AuditUploadHistory,
  AuditFollowUp,
  AuditTargetDateRevision,
  AuditActionItemStatus,
  AuditObservationStatus,
  AuditRiskRating,
} from '../../../../core/models/models';

export interface AuditApiResult<T> {
  data: T[];
  totalData: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditCarService {
  private currentUserSubject = new BehaviorSubject<AuditUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Simulate current logged-in user (in production, from auth service)
  private mockCurrentUser: AuditUser = {
    id: 'AUD001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@xyz.com',
    employeeId: 'EMP-AUD-001',
    role: 'Audit Team',
    division: 'Internal Audit',
    department: 'Internal Audit',
  };

  constructor(private http: HttpClient) {
    this.currentUserSubject.next(this.mockCurrentUser);
  }

  getCurrentUser(): AuditUser {
    return this.mockCurrentUser;
  }

  setCurrentUser(user: AuditUser): void {
    this.mockCurrentUser = user;
    this.currentUserSubject.next(user);
  }

  getObservations(): Observable<AuditApiResult<AuditObservation>> {
    return this.http.get<AuditApiResult<AuditObservation>>('assets/json/audit-observations.json').pipe(
      map((res) => res)
    );
  }

  getObservationById(id: string): Observable<AuditObservation | undefined> {
    return this.getObservations().pipe(
      map((res) => res.data.find((o) => o.id === id || o.observationId === id))
    );
  }

  getUsers(): Observable<AuditApiResult<AuditUser>> {
    return this.http.get<AuditApiResult<AuditUser>>('assets/json/audit-users.json').pipe(
      map((res) => res)
    );
  }

  getDashboardStats(): Observable<AuditDashboardStats> {
    return this.http.get<AuditDashboardStats>('assets/json/audit-dashboard-stats.json');
  }

  getUploadHistory(): Observable<AuditApiResult<AuditUploadHistory>> {
    return this.http.get<AuditApiResult<AuditUploadHistory>>('assets/json/audit-upload-history.json').pipe(
      map((res) => res)
    );
  }

  getObservationsByUser(userId: string): Observable<AuditObservation[]> {
    return this.getObservations().pipe(
      map((res) =>
        res.data.filter((obs) =>
          obs.actionItems.some((ai) => ai.responsiblePersonId === userId)
        )
      )
    );
  }

  getObservationsByHoD(hodDivision: string): Observable<AuditObservation[]> {
    return this.getObservations().pipe(
      map((res) =>
        res.data.filter((obs) => obs.division === hodDivision)
      )
    );
  }

  generateObservationId(year: number): string {
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `OBS-${year}-${rand}`;
  }

  generateActionItemId(observationId: string, index: number): string {
    return `AI-${observationId.split('-').pop()}-${String(index).padStart(2, '0')}`;
  }

  getStatusBadgeClass(status: AuditActionItemStatus | AuditObservationStatus): string {
    const map: Record<string, string> = {
      'Not Due': 'badge-soft-info',
      Overdue: 'badge-soft-danger',
      'Partially Open': 'badge-soft-warning',
      'Request Closure': 'badge-soft-primary',
      Closed: 'badge-soft-success',
      Open: 'badge-soft-danger',
      'Partially Closed': 'badge-soft-warning',
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

  isOverdue(currentTargetDate: string, status: AuditActionItemStatus): boolean {
    if (status === 'Closed') return false;
    const today = new Date();
    const target = new Date(currentTargetDate);
    return target < today;
  }

  getDaysRemaining(targetDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  computeOverallStatus(actionItems: AuditActionItem[]): AuditObservationStatus {
    if (!actionItems.length) return 'Open';
    const allClosed = actionItems.every((ai) => ai.status === 'Closed');
    const someClosed = actionItems.some((ai) => ai.status === 'Closed');
    if (allClosed) return 'Closed';
    if (someClosed) return 'Partially Closed';
    return 'Open';
  }

  // Mock save methods (in real app these would be POST/PUT API calls)
  saveObservation(obs: AuditObservation): Observable<AuditObservation> {
    return of(obs);
  }

  updateActionItem(actionItem: AuditActionItem): Observable<AuditActionItem> {
    return of(actionItem);
  }

  addFollowUp(followUp: AuditFollowUp): Observable<AuditFollowUp> {
    return of(followUp);
  }

  reviseTargetDate(revision: AuditTargetDateRevision): Observable<AuditTargetDateRevision> {
    return of(revision);
  }

  exportToExcel(observations: AuditObservation[]): void {
    const headers = [
      'Observation ID', 'Audit Year', 'Audit Area', 'Division', 'Risk Rating',
      'Observation', 'Details of Findings', 'Management Commitment',
      'Responsible Person', 'Initial Target Date', 'Current Target Date',
      'Status', 'Action Taken', 'Management Comment', 'Auditor Comment', 'Overall Status',
    ];

    const rows: string[][] = [];
    observations.forEach((obs) => {
      obs.actionItems.forEach((ai) => {
        rows.push([
          obs.observationId, String(obs.auditYear), obs.auditArea, obs.division, obs.riskRating,
          obs.observation, obs.detailsOfFindings, obs.managementCommitment,
          ai.responsiblePersonName, ai.initialTargetDate, ai.currentTargetDate,
          ai.status, ai.actionTaken ?? '', ai.managementComment ?? '',
          obs.auditorClosureComment ?? '', obs.overallStatus,
        ]);
      });
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Observations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
