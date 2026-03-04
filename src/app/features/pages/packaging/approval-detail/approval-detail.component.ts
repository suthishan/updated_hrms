import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data/data.service';
import {
  apiResultFormat, breadCrumbItems, PackagingDocument,
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
    { label: 'Approval Inbox', route: '/pages/packaging/inbox' },
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

  constructor(
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.docId = this.route.snapshot.paramMap.get('id') || '';
    this.data.getPackagingDocuments().subscribe((res: apiResultFormat) => {
      const docs = res.data as unknown as PackagingDocument[];
      this.document = docs.find(d => d.id === this.docId) || null;
      this.isLoading = false;
    });
  }

  get currentStep(): PackagingApprovalStep | null {
    if (!this.document) return null;
    return this.document.approvalSteps[this.document.currentStepIndex] || null;
  }

  get pendingApprovers(): PackagingStepApprover[] {
    return this.currentStep?.approvers.filter(a => a.status === 'pending') || [];
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
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      if (action === 'approved') {
        this.decisionSuccess = 'Document approved successfully! Moving to next approval step.';
      } else {
        this.decisionSuccess = 'Document rejected. Initiator has been notified with your remarks.';
      }
      setTimeout(() => this.router.navigate(['/pages/packaging/inbox']), 2000);
    }, 1200);
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
