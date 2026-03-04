import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import {
  AuditDashboardStats,
  AuditObservation,
  AuditUser,
  AuditActionItem,
  AuditUserRole,
} from '../../../../core/models/models';
import { routes } from '../../../../core/routes/routes';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './audit-dashboard.component.html',
  styleUrl: './audit-dashboard.component.scss',
})
export class AuditDashboardComponent implements OnInit {
  stats: AuditDashboardStats | null = null;
  observations: AuditObservation[] = [];
  filteredObservations: AuditObservation[] = [];
  currentUser: AuditUser | null = null;
  activeTab: 'all' | 'overdue' | 'partial' = 'all';
  selectedYear = new Date().getFullYear();
  availableYears: number[] = [2022, 2023, 2024];

  // View mode controlled by user role
  viewMode: AuditUserRole = 'Audit Team';
  routes = routes;

  // For simulating role switch (demo)
  demoRoles: AuditUserRole[] = ['Audit Team', 'HoD', 'Responsible Person'];

  overdueItems: { obs: AuditObservation; ai: AuditActionItem }[] = [];

  constructor(private auditService: AuditCarService) {}

  ngOnInit(): void {
    this.currentUser = this.auditService.getCurrentUser();
    this.viewMode = this.currentUser.role;
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.auditService.getDashboardStats().subscribe((s) => (this.stats = s));
    this.auditService.getObservations().subscribe((res) => {
      this.observations = res.data;
      this.applyFilters();
      this.buildOverdueItems();
    });
  }

  applyFilters(): void {
    let obs = this.observations;
    if (this.activeTab === 'overdue') {
      obs = obs.filter((o) =>
        o.actionItems.some((ai) =>
          this.auditService.isOverdue(ai.currentTargetDate, ai.status)
        )
      );
    } else if (this.activeTab === 'partial') {
      obs = obs.filter((o) => o.overallStatus === 'Partially Closed');
    }
    this.filteredObservations = obs;
  }

  buildOverdueItems(): void {
    this.overdueItems = [];
    this.observations.forEach((obs) => {
      obs.actionItems.forEach((ai) => {
        if (this.auditService.isOverdue(ai.currentTargetDate, ai.status)) {
          this.overdueItems.push({ obs, ai });
        }
      });
    });
  }

  setTab(tab: 'all' | 'overdue' | 'partial'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  switchRole(role: AuditUserRole): void {
    this.viewMode = role;
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status as never);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as never);
  }

  getDaysRemaining(date: string): number {
    return this.auditService.getDaysRemaining(date);
  }

  isOverdue(date: string, status: string): boolean {
    return this.auditService.isOverdue(date, status as never);
  }

  get openCount(): number {
    return this.observations.filter((o) => o.overallStatus === 'Open').length;
  }

  get closedCount(): number {
    return this.observations.filter((o) => o.overallStatus === 'Closed').length;
  }

  get partialCount(): number {
    return this.observations.filter((o) => o.overallStatus === 'Partially Closed').length;
  }

  get overdueCount(): number {
    return this.overdueItems.length;
  }

  get highRiskCount(): number {
    return this.observations.filter((o) => o.riskRating === 'High').length;
  }

  get riskChartData(): { label: string; value: number; color: string }[] {
    return [
      { label: 'High', value: this.observations.filter((o) => o.riskRating === 'High').length, color: '#f44336' },
      { label: 'Medium', value: this.observations.filter((o) => o.riskRating === 'Medium').length, color: '#ff9800' },
      { label: 'Low', value: this.observations.filter((o) => o.riskRating === 'Low').length, color: '#2196f3' },
      { label: 'Improvement', value: this.observations.filter((o) => o.riskRating === 'Improvement').length, color: '#9c27b0' },
    ];
  }

  getProgressWidth(value: number, total: number): string {
    if (!total) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  }
}
