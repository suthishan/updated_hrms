import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditObservation, AuditDashboardStats, AuditRiskRating } from '../../../../core/models/models';

type DashTab = 'all' | 'overdue' | 'repeated';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './audit-dashboard.component.html',
  styleUrl: './audit-dashboard.component.scss',
})
export class AuditDashboardComponent implements OnInit {
  observations: AuditObservation[] = [];
  filteredObservations: AuditObservation[] = [];
  pendingAuditorObservations: AuditObservation[] = [];
  stats: AuditDashboardStats | null = null;
  loading = true;
  pendingLoading = false;
  errorMsg = '';

  activeTab: DashTab = 'all';
  filterYear = '';
  availableYears: number[] = [];

  constructor(private auditService: AuditCarService, private router: Router) {}

  ngOnInit(): void {
    const yr = new Date().getFullYear();
    this.availableYears = [yr, yr - 1, yr - 2, yr - 3];
    this.loadAll();
    this.loadPendingAuditor();
  }

  loadAll(): void {
    this.loading = true;
    const filters = this.filterYear
      ? { audit_year: Number(this.filterYear), limit: 500, offset: 0 }
      : { limit: 500, offset: 0 };
    this.auditService.getObservations(filters).subscribe({
      next: ({ rows }) => {
        this.observations = rows;
        this.stats = this.auditService.buildDashboardStats(rows);
        this.applyTab();
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Failed to load data.';
        this.loading = false;
      },
    });
  }

  loadPendingAuditor(): void {
    this.pendingLoading = true;
    this.auditService.getObservations({ status: 'Request Closure', limit: 100, offset: 0 }).subscribe({
      next: ({ rows }) => {
        this.pendingAuditorObservations = rows;
        this.pendingLoading = false;
      },
      error: () => { this.pendingLoading = false; },
    });
  }

  applyTab(): void {
    switch (this.activeTab) {
      case 'overdue':
        this.filteredObservations = this.observations.filter((o) => o.status === 'Overdue');
        break;
      case 'repeated':
        this.filteredObservations = this.observations.filter((o) => o.status === 'Repeated');
        break;
      default:
        this.filteredObservations = [...this.observations];
    }
  }

  setTab(tab: DashTab): void {
    this.activeTab = tab;
    this.applyTab();
  }

  onYearChange(): void {
    this.loadAll();
  }

  /** Navigate to list page with a pre-applied status filter */
  goToList(status?: string): void {
    const qp = status ? { status } : {};
    this.router.navigate(['/audit-car/observations/list'], { queryParams: qp });
  }

  /** Navigate to list with risk-rating filter */
  goToListByRisk(risk: string): void {
    this.router.navigate(['/audit-car/observations/list'], { queryParams: { risk } });
  }

  /** Navigate to list with division filter */
  goToListByDivision(division: string): void {
    this.router.navigate(['/audit-car/observations/list'], { queryParams: { division } });
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as AuditRiskRating);
  }

  getProgressWidth(value: number, total: number): string {
    return this.auditService.getProgressWidth(value, total);
  }

  get riskChartData(): { label: string; value: number; color: string }[] {
    if (!this.stats) return [];
    return [
      { label: 'High',        value: this.stats.byRiskRating.high,        color: '#f44336' },
      { label: 'Medium',      value: this.stats.byRiskRating.medium,      color: '#ff9800' },
      { label: 'Low',         value: this.stats.byRiskRating.low,         color: '#2196f3' },
      { label: 'Improvement', value: this.stats.byRiskRating.improvement, color: '#9c27b0' },
    ];
  }

  effectiveTarget(obs: AuditObservation): string {
    return obs.updatedTargetDate1 || obs.initialTargetDate || '';
  }
}
