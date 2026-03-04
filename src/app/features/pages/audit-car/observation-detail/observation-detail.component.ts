import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import {
  AuditObservation,
  AuditActionItem,
  AuditUser,
  AuditFollowUp,
  AuditTargetDateRevision,
  AuditActionItemStatus,
} from '../../../../core/models/models';

@Component({
  selector: 'app-observation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './observation-detail.component.html',
  styleUrl: './observation-detail.component.scss',
})
export class ObservationDetailComponent implements OnInit {
  observation: AuditObservation | null = null;
  currentUser: AuditUser | null = null;
  selectedActionItem: AuditActionItem | null = null;
  activeTab = 'overview';

  // Follow-up form
  followUpForm: FormGroup;
  showFollowUpForm = false;

  // Target date revision form
  targetDateForm: FormGroup;
  showTargetDateForm = false;

  // Action taken update
  actionTakenForm: FormGroup;
  showActionTakenForm = false;

  // Auditor confirmation
  auditorForm: FormGroup;
  showAuditorForm = false;

  // Auditor overall closure
  closureForm: FormGroup;
  showClosureForm = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditCarService,
    private fb: FormBuilder
  ) {
    this.followUpForm = this.fb.group({ remarks: ['', Validators.required] });
    this.targetDateForm = this.fb.group({
      newDate: ['', Validators.required],
      reason: ['', Validators.required],
    });
    this.actionTakenForm = this.fb.group({
      actionTaken: ['', Validators.required],
      status: ['', Validators.required],
      managementComment: [''],
    });
    this.auditorForm = this.fb.group({
      confirmationStatus: ['', Validators.required],
      confirmationComment: [''],
    });
    this.closureForm = this.fb.group({
      auditorClosureComment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auditService.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.auditService.getObservationById(id).subscribe((obs) => {
        if (obs) {
          this.observation = obs;
          if (obs.actionItems.length > 0) {
            this.selectActionItem(obs.actionItems[0]);
          }
        }
      });
    }
  }

  selectActionItem(ai: AuditActionItem): void {
    this.selectedActionItem = ai;
    this.closeAllForms();
    if (this.isResponsiblePerson(ai)) {
      this.actionTakenForm.patchValue({
        actionTaken: ai.actionTaken ?? '',
        status: ai.status,
        managementComment: ai.managementComment ?? '',
      });
    }
    if (this.isAuditTeam) {
      this.auditorForm.patchValue({
        confirmationStatus: ai.auditorConfirmationStatus ?? '',
        confirmationComment: ai.auditorConfirmationComment ?? '',
      });
    }
  }

  closeAllForms(): void {
    this.showFollowUpForm = false;
    this.showTargetDateForm = false;
    this.showActionTakenForm = false;
    this.showAuditorForm = false;
    this.showClosureForm = false;
  }

  isResponsiblePerson(ai: AuditActionItem): boolean {
    return ai.responsiblePersonId === this.currentUser?.id ||
      this.currentUser?.role === 'Responsible Person';
  }

  get isAuditTeam(): boolean {
    return this.currentUser?.role === 'Audit Team';
  }

  get isHoD(): boolean {
    return this.currentUser?.role === 'HoD';
  }

  // ─── Follow-up ─────────────────────────────────────────────────────────────
  submitFollowUp(): void {
    if (this.followUpForm.invalid || !this.selectedActionItem) return;
    const followUp: AuditFollowUp = {
      id: `FU-${Date.now()}`,
      actionItemId: this.selectedActionItem.id,
      date: new Date().toISOString().split('T')[0],
      remarks: this.followUpForm.value.remarks,
      addedBy: this.currentUser?.id ?? '',
      addedByName: this.currentUser?.name ?? '',
    };
    if (this.observation && this.selectedActionItem) {
      const ai = this.observation.actionItems.find((a) => a.id === this.selectedActionItem!.id);
      if (ai) {
        ai.followUps = [...(ai.followUps ?? []), followUp];
        this.selectedActionItem = { ...ai };
      }
    }
    this.followUpForm.reset();
    this.showFollowUpForm = false;
  }

  // ─── Target Date Revision ──────────────────────────────────────────────────
  submitTargetDateRevision(): void {
    if (this.targetDateForm.invalid || !this.selectedActionItem) return;
    const revision: AuditTargetDateRevision = {
      id: `TDR-${Date.now()}`,
      actionItemId: this.selectedActionItem.id,
      previousDate: this.selectedActionItem.currentTargetDate,
      newDate: this.targetDateForm.value.newDate,
      reason: this.targetDateForm.value.reason,
      revisedDate: new Date().toISOString().split('T')[0],
      revisedBy: this.currentUser?.id ?? '',
      revisedByName: this.currentUser?.name ?? '',
    };
    if (this.observation) {
      const ai = this.observation.actionItems.find((a) => a.id === this.selectedActionItem!.id);
      if (ai) {
        ai.targetDateRevisions = [...(ai.targetDateRevisions ?? []), revision];
        ai.currentTargetDate = revision.newDate;
        this.selectedActionItem = { ...ai };
      }
    }
    this.targetDateForm.reset();
    this.showTargetDateForm = false;
  }

  // ─── Action Taken Update ───────────────────────────────────────────────────
  submitActionTaken(): void {
    if (this.actionTakenForm.invalid || !this.selectedActionItem || !this.observation) return;
    const ai = this.observation.actionItems.find((a) => a.id === this.selectedActionItem!.id);
    if (ai) {
      ai.actionTaken = this.actionTakenForm.value.actionTaken;
      ai.status = this.actionTakenForm.value.status as AuditActionItemStatus;
      ai.managementComment = this.actionTakenForm.value.managementComment;
      this.selectedActionItem = { ...ai };
      this.observation.overallStatus = this.auditService.computeOverallStatus(this.observation.actionItems);
    }
    this.showActionTakenForm = false;
  }

  // ─── Auditor Confirmation ──────────────────────────────────────────────────
  submitAuditorConfirmation(): void {
    if (this.auditorForm.invalid || !this.selectedActionItem || !this.observation) return;
    const ai = this.observation.actionItems.find((a) => a.id === this.selectedActionItem!.id);
    if (ai) {
      ai.auditorConfirmationStatus = this.auditorForm.value.confirmationStatus;
      ai.auditorConfirmationComment = this.auditorForm.value.confirmationComment;
      if (ai.auditorConfirmationStatus === 'Confirmed') {
        ai.status = 'Closed';
        ai.closureDate = new Date().toISOString().split('T')[0];
      } else if (ai.auditorConfirmationStatus === 'Rejected') {
        ai.status = 'Partially Open';
      }
      this.selectedActionItem = { ...ai };
      this.observation.overallStatus = this.auditService.computeOverallStatus(this.observation.actionItems);
    }
    this.showAuditorForm = false;
  }

  // ─── Overall Closure ───────────────────────────────────────────────────────
  submitOverallClosure(): void {
    if (this.closureForm.invalid || !this.observation) return;
    this.observation.auditorClosureComment = this.closureForm.value.auditorClosureComment;
    this.observation.overallStatus = 'Closed';
    this.showClosureForm = false;
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status as never);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as never);
  }

  getDaysRemaining(date: string): number {
    return this.auditService.getDaysRemaining(date);
  }

  isOverdue(date: string, status: string): boolean {
    return this.auditService.isOverdue(date, status as never);
  }

  goBack(): void {
    this.router.navigate(['/audit-car/observations/list']);
  }
}
