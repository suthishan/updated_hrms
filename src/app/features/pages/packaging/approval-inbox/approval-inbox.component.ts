import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data/data.service';
import { apiResultFormat, breadCrumbItems, PackagingDocument, PackagingDocStatus } from '../../../../core/models/models';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-approval-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BreadcrumbsComponent],
  templateUrl: './approval-inbox.component.html',
  styleUrl: './approval-inbox.component.scss'
})
export class ApprovalInboxComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Approval Inbox', active: true }
  ];

  allDocuments: PackagingDocument[] = [];
  filteredDocuments: PackagingDocument[] = [];
  searchQuery = '';
  filterStatus: PackagingDocStatus | '' = '';
  filterWorkflow = '';
  pageSize = 10;
  currentPage = 1;

  statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Review', value: 'in-review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  workflowOptions = [
    { label: 'All Workflows', value: '' },
    { label: 'Sequential', value: 'sequential' },
    { label: 'Parallel', value: 'parallel' },
    { label: 'Hybrid', value: 'hybrid' }
  ];

  constructor(private data: DataService) {}

  ngOnInit(): void {
    this.data.getPackagingDocuments().subscribe((res: apiResultFormat) => {
      this.allDocuments = res.data as unknown as PackagingDocument[];
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredDocuments = this.allDocuments.filter(doc => {
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.productName.toLowerCase().includes(q) ||
        doc.initiator.toLowerCase().includes(q) ||
        doc.batchRef.toLowerCase().includes(q);
      const matchesStatus = !this.filterStatus || doc.status === this.filterStatus;
      const matchesWorkflow = !this.filterWorkflow || doc.workflowType === this.filterWorkflow;
      return matchesSearch && matchesStatus && matchesWorkflow;
    });
    this.currentPage = 1;
  }

  get paginatedDocuments(): PackagingDocument[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDocuments.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDocuments.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
      approved: 'Approved', rejected: 'Rejected',
      'in-review': 'In Review', pending: 'Pending', draft: 'Draft'
    };
    return map[status] || status;
  }

  getWorkflowBadgeClass(type: string): string {
    return { sequential: 'badge-soft-primary', parallel: 'badge-soft-success', hybrid: 'badge-soft-warning' }[type] || 'badge-soft-secondary';
  }

  getCurrentApprover(doc: PackagingDocument): string {
    const step = doc.approvalSteps[doc.currentStepIndex];
    if (!step) return '—';
    const pending = step.approvers.filter(a => a.status === 'pending');
    return pending.length > 0 ? pending.map(a => a.role).join(', ') : step.approvers.map(a => a.role).join(', ');
  }

  getProgressPercent(doc: PackagingDocument): number {
    if (!doc.approvalSteps.length) return 0;
    const done = doc.approvalSteps.filter(s => s.status === 'completed').length;
    return Math.round((done / doc.approvalSteps.length) * 100);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterWorkflow = '';
    this.applyFilter();
  }
}
