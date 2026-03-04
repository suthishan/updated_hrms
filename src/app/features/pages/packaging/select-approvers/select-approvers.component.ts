import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data/data.service';
import {
  apiResultFormat,
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

  constructor(private data: DataService, private router: Router) {}

  ngOnInit(): void {
    this.data.getPackagingApprovers().subscribe((res: apiResultFormat) => {
      this.approvers = res.data as unknown as PackagingApprover[];
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
    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Approval workflow configured successfully! Document sent for review.';
      setTimeout(() => this.router.navigate(['/pages/packaging/inbox']), 1500);
    }, 1200);
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
