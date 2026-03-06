import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PackagingService, SubmitPayload } from '../services/packaging.service';
import {
  breadCrumbItems,
  PackagingApprover,
  PackagingWorkflowStep,
  PackagingWorkflowType
} from '../../../../core/models/models';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-select-approvers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BreadcrumbsComponent],
  templateUrl: './select-approvers.component.html',
  styleUrl: './select-approvers.component.scss'
})
export class SelectApproversComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Select Approvers', active: true }
  ];

  approvers: PackagingApprover[] = [];
  workflowType: PackagingWorkflowType = 'sequential';
  workflowSteps: PackagingWorkflowStep[] = [];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  searchQuery = '';

  // For building the workflow
  currentStepApprovers: PackagingApprover[] = [];
  stepType: 'sequential' | 'parallel' = 'sequential';
  editingStepIndex = -1;

  draftMeta: { requestId?: number; title?: string; productName?: string; productCategory?: string; batchRef?: string; description?: string } = {};

  constructor(private packaging: PackagingService, private router: Router) {}

  ngOnInit(): void {
    // Read draft metadata stored by UploadCreativeComponent
    const raw = sessionStorage.getItem('pkg_draft');
    if (raw) {
      try { this.draftMeta = JSON.parse(raw); } catch { /* ignore */ }
    }
    this.packaging.getApprovers().subscribe({
      next: (approvers: PackagingApprover[]) => { this.approvers = approvers; },
      error: () => {}
    });
    this.addStep();
  }

  get filteredApprovers(): PackagingApprover[] {
    const q = this.searchQuery.toLowerCase();
    return this.approvers.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  }

  setWorkflowType(type: PackagingWorkflowType): void {
    this.workflowType = type;
    if (type === 'sequential') {
      this.workflowSteps.forEach(s => (s.stepType = 'sequential'));
    } else if (type === 'parallel') {
      this.workflowSteps.forEach(s => (s.stepType = 'parallel'));
    }
  }

  addStep(): void {
    this.workflowSteps.push({
      stepNumber: this.workflowSteps.length + 1,
      stepType: this.workflowType === 'parallel' ? 'parallel' : 'sequential',
      selectedApprovers: []
    });
  }

  removeStep(index: number): void {
    if (this.workflowSteps.length > 1) {
      this.workflowSteps.splice(index, 1);
      this.workflowSteps.forEach((s, i) => (s.stepNumber = i + 1));
    }
  }

  toggleApproverInStep(step: PackagingWorkflowStep, approver: PackagingApprover): void {
    const idx = step.selectedApprovers.findIndex(a => a.id === approver.id);
    if (idx > -1) {
      step.selectedApprovers.splice(idx, 1);
    } else {
      step.selectedApprovers.push(approver);
    }
  }

  isApproverInStep(step: PackagingWorkflowStep, approver: PackagingApprover): boolean {
    return step.selectedApprovers.some(a => a.id === approver.id);
  }

  isApproverUsed(approver: PackagingApprover): boolean {
    return this.workflowSteps.some(s => s.selectedApprovers.some(a => a.id === approver.id));
  }

  removeApproverFromStep(step: PackagingWorkflowStep, approverId: string): void {
    step.selectedApprovers = step.selectedApprovers.filter(a => a.id !== approverId);
  }

  get totalApprovers(): number {
    const ids = new Set<string>();
    this.workflowSteps.forEach(s => s.selectedApprovers.forEach(a => ids.add(a.id)));
    return ids.size;
  }

  onSubmit(): void {
    this.errorMessage = '';
    const hasEmptyStep = this.workflowSteps.some(s => s.selectedApprovers.length === 0);
    if (hasEmptyStep) {
      this.errorMessage = 'Each approval step must have at least one approver assigned.';
      return;
    }
    if (!this.draftMeta.requestId) {
      this.errorMessage = 'Draft request not found. Please go back and re-upload the creative.';
      return;
    }
    this.isSubmitting = true;

    const payload: SubmitPayload = {
      requestId:       this.draftMeta.requestId,
      title:           this.draftMeta.title           ?? '',
      productName:     this.draftMeta.productName     ?? '',
      productCategory: this.draftMeta.productCategory ?? '',
      batchRef:        this.draftMeta.batchRef        ?? '',
      description:     this.draftMeta.description     ?? '',
      workflowType:    this.workflowType,
      workflowSteps:   this.workflowSteps.map(s => ({
        stepNumber: s.stepNumber,
        stepType:   s.stepType,
        approvers:  s.selectedApprovers.map(a => ({
          emp_uuid: a.id,
          name:     a.name,
          email:    a.email,
          role:     a.role,
        })),
      })),
    };

    this.packaging.submitRequest(payload).subscribe({
      next: () => {
        this.isSubmitting   = false;
        this.successMessage = 'Approval workflow configured successfully! Document sent for review.';
        sessionStorage.removeItem('pkg_draft');
        setTimeout(() => this.router.navigate(['/pages/packaging/inbox']), 1500);
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        this.errorMessage = err.message;
      }
    });
  }

  getLocationBadgeClass(location: string): string {
    const map: Record<string, string> = {
      'Supa': 'badge-soft-primary',
      'KGP': 'badge-soft-info',
      'Bhubaneswar': 'badge-soft-warning'
    };
    return map[location] || 'badge-soft-secondary';
  }
}
