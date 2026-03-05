import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService, ObservationFilters } from '../services/audit-car.service';
import { AuditObservation, AuditRiskRating } from '../../../../core/models/models';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './observation-list.component.html',
  styleUrl: './observation-list.component.scss',
})
export class ObservationListComponent implements OnInit {
  observations: AuditObservation[] = [];
  loading = false;
  errorMsg = '';

  // Filters (server-side)
  filterYear = '';
  filterRisk = '';
  filterStatus = '';
  // search is client-side (applied after server fetch)
  searchTerm = '';

  // Sort (client-side on current page)
  sortField = 'observationNumber';
  sortAsc = false;

  // Pagination
  pageSize = 20;
  currentPage = 1;
  totalRecords = 0;

  availableYears: number[] = [];

  constructor(private auditService: AuditCarService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const yr = new Date().getFullYear();
    this.availableYears = [yr, yr - 1, yr - 2, yr - 3];

    // Pre-populate filters from dashboard navigation queryParams
    const qp = this.route.snapshot.queryParamMap;
    if (qp.get('status'))   this.filterStatus = qp.get('status')!;
    if (qp.get('risk'))     this.filterRisk   = qp.get('risk')!;
    if (qp.get('division')) {
      // division is a free-text field; put it in search so client-side filter picks it up
      this.searchTerm = qp.get('division')!;
    }

    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    const filters: ObservationFilters = {
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
    };
    if (this.filterYear)   filters.audit_year   = Number(this.filterYear);
    if (this.filterRisk)   filters.risk_rating   = this.filterRisk;
    if (this.filterStatus) filters.status        = this.filterStatus;

    this.auditService.getObservations(filters).subscribe({
      next: ({ rows, total }) => {
        this.totalRecords = total;
        this.observations = this.searchTerm ? this.clientFilter(rows) : rows;
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Failed to load observations.';
        this.loading = false;
      },
    });
  }

  private clientFilter(rows: AuditObservation[]): AuditObservation[] {
    const term = this.searchTerm.toLowerCase();
    return rows.filter(
      (o) =>
        (o.observationNumber ?? '').toLowerCase().includes(term) ||
        (o.observationTitle ?? '').toLowerCase().includes(term) ||
        (o.auditArea ?? '').toLowerCase().includes(term) ||
        (o.division ?? '').toLowerCase().includes(term) ||
        (o.responsiblePerson ?? '').toLowerCase().includes(term)
    );
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.load();
  }

  clearFilters(): void {
    this.filterYear = '';
    this.filterRisk = '';
    this.filterStatus = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.load();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.observations = [...this.observations].sort((a, b) => {
      const rawA = (a as unknown as Record<string, unknown>)[this.sortField] ?? '';
      const rawB = (b as unknown as Record<string, unknown>)[this.sortField] ?? '';
      const valA = typeof rawA === 'string' ? rawA.toLowerCase() : rawA;
      const valB = typeof rawB === 'string' ? rawB.toLowerCase() : rawB;
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  sortIcon(field: string): string {
    if (this.sortField !== field) return 'ti ti-arrows-sort text-muted';
    return this.sortAsc ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.load();
  }

  downloadAnnexures(obs: AuditObservation, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    // Navigate to detail page where all annexures can be downloaded individually
    window.open(`/audit-car/observations/detail/${obs.observationId}`, '_blank');
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const p = this.currentPage;
    const out: number[] = [1];
    if (p > 3) out.push(-1);
    for (let i = Math.max(2, p - 1); i <= Math.min(total - 1, p + 1); i++) out.push(i);
    if (p < total - 2) out.push(-1);
    out.push(total);
    return out;
  }

  get startRecord(): number {
    return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as AuditRiskRating);
  }

  effectiveTarget(obs: AuditObservation): string {
    return obs.updatedTargetDate1 || obs.initialTargetDate || '';
  }
}
