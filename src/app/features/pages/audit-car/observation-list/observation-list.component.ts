import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditObservation, AuditUser, AuditRiskRating, AuditObservationStatus } from '../../../../core/models/models';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './observation-list.component.html',
  styleUrl: './observation-list.component.scss',
})
export class ObservationListComponent implements OnInit {
  observations: AuditObservation[] = [];
  filteredObservations: AuditObservation[] = [];
  currentUser: AuditUser | null = null;

  // Filters
  filterYear = '';
  filterDivision = '';
  filterRisk = '';
  filterStatus = '';
  searchTerm = '';

  // Sort
  sortField = 'observationId';
  sortAsc = true;

  // Pagination
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  availableYears: number[] = [];
  availableDivisions: string[] = [];

  constructor(private auditService: AuditCarService) {}

  ngOnInit(): void {
    this.currentUser = this.auditService.getCurrentUser();
    this.loadObservations();
  }

  loadObservations(): void {
    const role = this.currentUser?.role;
    if (role === 'Responsible Person' && this.currentUser?.id) {
      this.auditService.getObservationsByUser(this.currentUser.id).subscribe((data) => {
        this.observations = data;
        this.buildFilterOptions();
        this.applyFilters();
      });
    } else if (role === 'HoD' && this.currentUser?.division) {
      this.auditService.getObservationsByHoD(this.currentUser.division).subscribe((data) => {
        this.observations = data;
        this.buildFilterOptions();
        this.applyFilters();
      });
    } else {
      this.auditService.getObservations().subscribe((res) => {
        this.observations = res.data;
        this.buildFilterOptions();
        this.applyFilters();
      });
    }
  }

  buildFilterOptions(): void {
    this.availableYears = [...new Set(this.observations.map((o) => o.auditYear))].sort((a, b) => b - a);
    this.availableDivisions = [...new Set(this.observations.map((o) => o.division))].sort();
  }

  applyFilters(): void {
    let result = [...this.observations];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.observationId.toLowerCase().includes(term) ||
          o.observation.toLowerCase().includes(term) ||
          o.auditArea.toLowerCase().includes(term) ||
          o.division.toLowerCase().includes(term)
      );
    }
    if (this.filterYear) result = result.filter((o) => o.auditYear === Number(this.filterYear));
    if (this.filterDivision) result = result.filter((o) => o.division === this.filterDivision);
    if (this.filterRisk) result = result.filter((o) => o.riskRating === this.filterRisk);
    if (this.filterStatus) result = result.filter((o) => o.overallStatus === this.filterStatus);

    // Sort
    result.sort((a, b) => {
      const rawA = (a as Record<string, unknown>)[this.sortField] ?? '';
      const rawB = (b as Record<string, unknown>)[this.sortField] ?? '';
      const valA = typeof rawA === 'string' ? rawA.toLowerCase() : rawA;
      const valB = typeof rawB === 'string' ? rawB.toLowerCase() : rawB;
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.totalPages = Math.ceil(result.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = 1;
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredObservations = result.slice(start, start + this.pageSize);
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return 'ti ti-arrows-sort text-muted';
    return this.sortAsc ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
  }

  clearFilters(): void {
    this.filterYear = '';
    this.filterDivision = '';
    this.filterRisk = '';
    this.filterStatus = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status as never);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as AuditRiskRating);
  }

  getOverdueCount(obs: AuditObservation): number {
    return obs.actionItems.filter((ai) =>
      this.auditService.isOverdue(ai.currentTargetDate, ai.status)
    ).length;
  }

  exportData(): void {
    this.auditService.exportToExcel(this.observations);
  }

  get isAuditTeam(): boolean {
    return this.currentUser?.role === 'Audit Team';
  }
}
