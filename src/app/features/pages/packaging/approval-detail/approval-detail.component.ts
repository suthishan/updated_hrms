import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PackagingService } from '../services/packaging.service';
import {
  breadCrumbItems, PackagingDocument,
  PackagingApprovalStep, PackagingStepApprover
} from '../../../../core/models/models';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-approval-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BreadcrumbsComponent],
  templateUrl: './approval-detail.component.html',
  styleUrl: './approval-detail.component.scss'
})
export class ApprovalDetailComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Approval Inbox' },
    { label: 'Document Detail', active: true }
  ];

  document: PackagingDocument | null = null;
  docId = '';
  isLoading = true;

  // Decision form
  decisionRemarks = '';
  isSubmitting = false;
  decisionError = '';
  decisionSuccess = '';

  // View file modal
  selectedFileUrl = '';
  selectedFileName = '';

  private get empRole(): 'REQUESTER' | 'APPROVER' | 'ADMIN' {
    return (localStorage.getItem('emp_role') ?? 'APPROVER') as 'REQUESTER' | 'APPROVER' | 'ADMIN';
  }

  constructor(
    private packaging: PackagingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.docId = this.route.snapshot.paramMap.get('id') || '';
    this.packaging.getRequestById(this.docId).subscribe({
      next: (doc: PackagingDocument) => {
        this.document  = doc;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.decisionError = err.message;
        this.isLoading     = false;
      }
    });
  }

  get currentStep(): PackagingApprovalStep | null {
    if (!this.document) return null;
    return this.document.approvalSteps[this.document.currentStepIndex] || null;
  }

  get pendingApprovers(): PackagingStepApprover[] {
    return this.currentStep?.approvers.filter(a => a.status === 'pending') || [];
  }

  get pendingApproverRoles(): string {
    const roles = this.pendingApprovers.map(a => a.role);
    return roles.length ? roles.join(', ') : 'approver(s)';
  }

  get canTakeAction(): boolean {
    return !!(this.document && (this.document.status === 'in-review' || this.document.status === 'pending'));
  }

  submitDecision(action: 'approved' | 'rejected'): void {
    this.decisionError = '';
    if (action === 'rejected' && !this.decisionRemarks.trim()) {
      this.decisionError = 'Please provide a reason for rejection.';
      return;
    }
    if (!this.document) return;
    const level = (this.document.currentStepIndex ?? 0) + 1;
    this.isSubmitting = true;
    this.packaging.approve({
      request_id: Number(this.document.id),
      level,
      decision:   action === 'approved' ? 'APPROVED' : 'REJECTED',
      remarks:    this.decisionRemarks || undefined,
    }).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        if (result.success) {
          this.decisionSuccess = action === 'approved'
            ? 'Document approved successfully! Moving to next approval step.'
            : 'Document rejected. Initiator has been notified with your remarks.';
          setTimeout(() => this.router.navigate(['/pages/packaging/inbox']), 2000);
        } else {
          this.decisionError = result.message;
        }
      },
      error: (err: Error) => {
        this.isSubmitting  = false;
        this.decisionError = err.message;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      approved: 'badge-soft-success', rejected: 'badge-soft-danger',
      'in-review': 'badge-soft-warning', pending: 'badge-soft-info',
      draft: 'badge-soft-secondary', 'in-progress': 'badge-soft-warning'
    };
    return map[status] || 'badge-soft-secondary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      approved: 'Approved', rejected: 'Rejected', 'in-review': 'In Review',
      pending: 'Pending', draft: 'Draft', 'in-progress': 'In Progress', completed: 'Completed'
    };
    return map[status] || status;
  }

  getApproverStatusIcon(status: string): string {
    const map: Record<string, string> = {
      approved: 'ti ti-circle-check text-success',
      rejected: 'ti ti-circle-x text-danger',
      pending: 'ti ti-clock text-warning'
    };
    return map[status] || 'ti ti-clock text-muted';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  openFile(url: string, name: string): void {
    this.selectedFileUrl = url;
    this.selectedFileName = name;
  }

  getCompletedSteps(doc: PackagingDocument): number {
    return doc.approvalSteps.filter(s => s.status === 'completed').length;
  }

  getProgressPercent(doc: PackagingDocument): number {
    if (!doc.approvalSteps.length) return 0;
    const done = doc.approvalSteps.filter(s => s.status === 'completed').length;
    return Math.round((done / doc.approvalSteps.length) * 100);
  }
}
