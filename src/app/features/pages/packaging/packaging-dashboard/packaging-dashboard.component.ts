import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PackagingService, DashboardStats } from '../services/packaging.service';
import { PackagingDocument, breadCrumbItems } from '../../../../core/models/models';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-packaging-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbsComponent],
  templateUrl: './packaging-dashboard.component.html',
  styleUrl: './packaging-dashboard.component.scss'
})
export class PackagingDashboardComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Dashboard', active: true }
  ];

  documents: PackagingDocument[] = [];
  totalDocs = 0;
  pendingDocs = 0;
  approvedDocs = 0;
  rejectedDocs = 0;
  inReviewDocs = 0;
  recentDocuments: PackagingDocument[] = [];
  isLoading = true;
  errorMessage = '';

  /** Read from localStorage — set by your AuthService on login */
  private get empUuid(): string { return localStorage.getItem('emp_uuid') ?? ''; }
  private get empRole(): 'REQUESTER' | 'APPROVER' | 'ADMIN' {
    const r = localStorage.getItem('emp_role') ?? 'REQUESTER';
    return r as 'REQUESTER' | 'APPROVER' | 'ADMIN';
  }

  constructor(private packaging: PackagingService) {}

  ngOnInit(): void {
    this.packaging.getDashboardStats(this.empUuid, this.empRole).subscribe({
      next: (stats: DashboardStats) => {
        this.totalDocs    = stats.totalRequests;
        this.pendingDocs  = stats.pending + stats.draft;
        this.approvedDocs = stats.approved;
        this.rejectedDocs = stats.rejected;
        this.inReviewDocs = stats.inReview;
      },
      error: () => {}
    });
    this.packaging.getRequests(this.empUuid, this.empRole, 10).subscribe({
      next: (docs: PackagingDocument[]) => {
        this.documents       = docs;
        this.recentDocuments = docs.slice(0, 5);
        this.isLoading       = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.isLoading    = false;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      approved: 'badge-soft-success',
      rejected: 'badge-soft-danger',
      'in-review': 'badge-soft-warning',
      pending: 'badge-soft-info',
      draft: 'badge-soft-secondary'
    };
    return map[status] || 'badge-soft-secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      approved: 'Approved',
      rejected: 'Rejected',
      'in-review': 'In Review',
      pending: 'Pending',
      draft: 'Draft'
    };
    return map[status] || status;
  }

  getWorkflowIcon(type: string): string {
    const map: Record<string, string> = {
      sequential: 'ti ti-arrow-right',
      parallel: 'ti ti-arrows-split',
      hybrid: 'ti ti-chart-arrows'
    };
    return map[type] || 'ti ti-help';
  }
}
