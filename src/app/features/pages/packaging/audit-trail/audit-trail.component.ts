import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PackagingService } from '../services/packaging.service';
import { breadCrumbItems, PackagingAuditTrail } from '../../../../core/models/models';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BreadcrumbsComponent],
  templateUrl: './audit-trail.component.html',
  styleUrl: './audit-trail.component.scss'
})
export class AuditTrailComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Audit Trail', active: true }
  ];

  allLogs: PackagingAuditTrail[] = [];
  filteredLogs: PackagingAuditTrail[] = [];
  searchQuery = '';
  filterAction = '';
  filterDoc = '';
  pageSize = 15;
  currentPage = 1;

  uniqueDocuments: { id: string; title: string }[] = [];

  actionOptions = [
    { label: 'All Actions', value: '' },
    { label: 'Uploaded', value: 'uploaded' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  isLoading = true;
  errorMessage = '';

  constructor(private packaging: PackagingService) {}

  ngOnInit(): void {
    this.packaging.getAuditTrail().subscribe({
      next: (logs: PackagingAuditTrail[]) => {
        this.allLogs = logs;
        const docMap = new Map<string, string>();
        logs.forEach(l => docMap.set(l.documentId, l.documentTitle));
        this.uniqueDocuments = Array.from(docMap.entries()).map(([id, title]) => ({ id, title }));
        this.isLoading = false;
        this.applyFilter();
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading    = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredLogs = this.allLogs.filter(log => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        log.documentTitle.toLowerCase().includes(q) ||
        log.performedBy.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);
      const matchesAction = !this.filterAction || log.actionType === this.filterAction;
      const matchesDoc = !this.filterDoc || log.documentId === this.filterDoc;
      return matchesSearch && matchesAction && matchesDoc;
    });
    this.currentPage = 1;
  }

  get paginatedLogs(): PackagingAuditTrail[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLogs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getActionBadgeClass(actionType: string): string {
    const map: Record<string, string> = {
      approved: 'badge-soft-success',
      rejected: 'badge-soft-danger',
      uploaded: 'badge-soft-info',
      submitted: 'badge-soft-primary',
      pending: 'badge-soft-warning'
    };
    return map[actionType] || 'badge-soft-secondary';
  }

  getActionIcon(actionType: string): string {
    const map: Record<string, string> = {
      approved: 'ti ti-circle-check text-success',
      rejected: 'ti ti-circle-x text-danger',
      uploaded: 'ti ti-cloud-upload text-info',
      submitted: 'ti ti-send text-primary',
      pending: 'ti ti-clock text-warning'
    };
    return map[actionType] || 'ti ti-activity text-muted';
  }

  countByAction(actionType: string): number {
    return this.allLogs.filter(l => l.actionType === actionType).length;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterAction = '';
    this.filterDoc = '';
    this.applyFilter();
  }
}
