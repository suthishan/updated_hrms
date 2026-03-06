import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data/data.service';
import { apiResultFormat, PackagingDocument, breadCrumbItems } from '../../../../core/models/models';
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

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getPackagingDocuments().subscribe((res: apiResultFormat) => {
      this.documents = res.data as unknown as PackagingDocument[];
      this.totalDocs = res.totalData;
      this.pendingDocs = this.documents.filter(d => d.status === 'pending' || d.status === 'draft').length;
      this.approvedDocs = this.documents.filter(d => d.status === 'approved').length;
      this.rejectedDocs = this.documents.filter(d => d.status === 'rejected').length;
      this.inReviewDocs = this.documents.filter(d => d.status === 'in-review').length;
      this.recentDocuments = this.documents.slice(0, 5);
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
