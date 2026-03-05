import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import {
  AuditObservation,
  AuditRiskRating,
  AuditAnnexure,
  AuditFollowupRecord,
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
  loading = true;
  errorMsg = '';

  // Annexures
  annexures: AuditAnnexure[] = [];
  annexuresLoading = false;
  annexureFiles: File[] = [];
  annexureDragOver = false;
  uploadingAnnexures = false;
  annexureMsg = '';

  // Follow-up trail
  followups: AuditFollowupRecord[] = [];
  followupsLoading = false;

  // Follow-up add form (Responsible Person)
  showFollowupForm = false;
  followupForm: FormGroup;
  followupFiles: File[] = [];
  submittingFollowup = false;
  followupSuccess = false;

  // Request Closure form (Responsible Person)
  showClosureRequestForm = false;
  closureRequestForm: FormGroup;
  closureRequestFiles: File[] = [];
  submittingClosureRequest = false;
  closureRequestSuccess = false;

  // Auditor Approve-Close form
  showAuditorCloseForm = false;
  auditorCloseForm: FormGroup;
  approvingClose = false;
  approveCloseSuccess = false;

  // Update status form (for Audit Team)
  updateForm: FormGroup;
  showUpdateForm = false;
  updating = false;
  updateSuccess = false;

  // Close observation form (direct auditor close, for non-RP-initiated)
  closeForm: FormGroup;
  showCloseForm = false;
  closing = false;
  closeSuccess = false;

  // Delete
  deleting = false;

  // Simulate current user — in real app, inject AuthService
  readonly CURRENT_USER_ID = 1;
  readonly IS_AUDITOR = true; // toggle based on logged-in role

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditCarService,
    private fb: FormBuilder
  ) {
    this.followupForm = this.fb.group({
      remarks: ['', Validators.required],
      updated_target_date: [''],
    });

    this.closureRequestForm = this.fb.group({
      remarks: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.auditorCloseForm = this.fb.group({
      closure_date:    [new Date().toISOString().split('T')[0], Validators.required],
      closure_remarks: ['', Validators.required],
    });

    this.updateForm = this.fb.group({
      subsequent_followup_1: [''],
      updated_target_date_1: [''],
      status: ['', Validators.required],
    });

    this.closeForm = this.fb.group({
      closure_date:    [new Date().toISOString().split('T')[0], Validators.required],
      closure_remarks: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.auditService.getObservationById(id).subscribe({
        next: (obs) => {
          this.observation = obs;
          this.loading = false;
          if (obs) {
            this.updateForm.patchValue({
              subsequent_followup_1: obs.subsequentFollowup1 ?? '',
              updated_target_date_1: obs.updatedTargetDate1  ?? '',
              status: obs.status,
            });
            this.loadAnnexures(id);
            this.loadFollowups(id);
          }
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Failed to load observation.';
          this.loading = false;
        },
      });
    }
  }

  // ─── Annexures ────────────────────────────────────────────────────────────

  loadAnnexures(id: number): void {
    this.annexuresLoading = true;
    this.auditService.listAnnexures(id).subscribe({
      next: (list) => { this.annexures = list; this.annexuresLoading = false; },
      error: () => { this.annexuresLoading = false; },
    });
  }

  onAnnexureFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.annexureFiles.push(...Array.from(input.files));
    input.value = '';
  }

  onAnnexureDragOver(event: DragEvent): void {
    event.preventDefault();
    this.annexureDragOver = true;
  }

  onAnnexureDrop(event: DragEvent): void {
    event.preventDefault();
    this.annexureDragOver = false;
    if (event.dataTransfer?.files) this.annexureFiles.push(...Array.from(event.dataTransfer.files));
  }

  removeAnnexureFile(i: number): void { this.annexureFiles.splice(i, 1); }

  uploadAnnexures(): void {
    if (!this.observation || this.annexureFiles.length === 0) return;
    this.uploadingAnnexures = true;
    this.annexureMsg = '';
    this.auditService.uploadAnnexures(this.observation.observationId, this.annexureFiles, this.CURRENT_USER_ID).subscribe({
      next: (added) => {
        this.annexures.push(...added);
        this.annexureFiles = [];
        this.uploadingAnnexures = false;
        this.annexureMsg = `${added.length} file(s) uploaded.`;
        if (this.observation) this.observation.annexureCount = (this.observation.annexureCount ?? 0) + added.length;
        setTimeout(() => (this.annexureMsg = ''), 3000);
      },
      error: (err: Error) => {
        this.annexureMsg = err.message ?? 'Upload failed.';
        this.uploadingAnnexures = false;
      },
    });
  }

  downloadAnnexure(annexure: AuditAnnexure): void {
    window.open(this.auditService.getAnnexureDownloadUrl(annexure.annexureId), '_blank');
  }

  deleteAnnexure(annexure: AuditAnnexure): void {
    if (!confirm(`Delete "${annexure.originalName}"?`)) return;
    this.auditService.deleteAnnexure(annexure.annexureId).subscribe({
      next: () => {
        this.annexures = this.annexures.filter((a) => a.annexureId !== annexure.annexureId);
        if (this.observation) this.observation.annexureCount = Math.max(0, (this.observation.annexureCount ?? 1) - 1);
      },
      error: (err: Error) => { this.errorMsg = err.message ?? 'Delete annexure failed.'; },
    });
  }

  // ─── Follow-ups ───────────────────────────────────────────────────────────

  loadFollowups(id: number): void {
    this.followupsLoading = true;
    this.auditService.listFollowups(id).subscribe({
      next: (list) => { this.followups = list; this.followupsLoading = false; },
      error: () => { this.followupsLoading = false; },
    });
  }

  onFollowupFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.followupFiles.push(...Array.from(input.files));
    input.value = '';
  }

  submitFollowup(): void {
    if (this.followupForm.invalid || !this.observation) return;
    this.submittingFollowup = true;
    const v = this.followupForm.value;
    this.auditService
      .addFollowup(
        this.observation.observationId,
        this.CURRENT_USER_ID,
        v.remarks,
        v.updated_target_date || undefined,
        this.followupFiles
      )
      .subscribe({
        next: (fu) => {
          this.followups.push(fu);
          if (v.updated_target_date && this.observation) {
            this.observation.updatedTargetDate1 = v.updated_target_date;
          }
          this.followupForm.reset({ remarks: '', updated_target_date: '' });
          this.followupFiles = [];
          this.showFollowupForm = false;
          this.submittingFollowup = false;
          this.followupSuccess = true;
          setTimeout(() => (this.followupSuccess = false), 3000);
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Follow-up submission failed.';
          this.submittingFollowup = false;
        },
      });
  }

  removeFollowupFile(i: number): void { this.followupFiles.splice(i, 1); }

  onClosureRequestFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.closureRequestFiles.push(...Array.from(input.files));
    input.value = '';
  }

  removeClosureRequestFile(i: number): void { this.closureRequestFiles.splice(i, 1); }

  submitClosureRequest(): void {
    if (this.closureRequestForm.invalid || !this.observation) return;
    this.submittingClosureRequest = true;
    const v = this.closureRequestForm.value;
    this.auditService
      .requestClosure(
        this.observation.observationId,
        this.CURRENT_USER_ID,
        v.remarks,
        this.closureRequestFiles
      )
      .subscribe({
        next: (updated) => {
          this.observation = updated;
          this.closureRequestFiles = [];
          this.showClosureRequestForm = false;
          this.submittingClosureRequest = false;
          this.closureRequestSuccess = true;
          setTimeout(() => (this.closureRequestSuccess = false), 3000);
          this.loadFollowups(updated.observationId);
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Closure request failed.';
          this.submittingClosureRequest = false;
        },
      });
  }

  // ─── Auditor Approval ─────────────────────────────────────────────────────

  submitAuditorClose(): void {
    if (this.auditorCloseForm.invalid || !this.observation) return;
    this.approvingClose = true;
    const v = this.auditorCloseForm.value;
    this.auditService
      .approveClose(
        this.observation.observationId,
        this.CURRENT_USER_ID,
        v.closure_date,
        v.closure_remarks
      )
      .subscribe({
        next: (updated) => {
          this.observation = updated;
          this.showAuditorCloseForm = false;
          this.approvingClose = false;
          this.approveCloseSuccess = true;
          setTimeout(() => (this.approveCloseSuccess = false), 3000);
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Approval failed.';
          this.approvingClose = false;
        },
      });
  }

  // ─── Update Status / Follow-up (Audit Team) ───────────────────────────────

  submitUpdate(): void {
    if (this.updateForm.invalid || !this.observation) return;
    this.updating = true;
    const v = this.updateForm.value;
    this.auditService
      .updateObservation(this.observation.observationId, {
        subsequent_followup_1: v.subsequent_followup_1 || undefined,
        updated_target_date_1: v.updated_target_date_1 || undefined,
        status: v.status,
      })
      .subscribe({
        next: (updated) => {
          this.observation = updated;
          this.updating = false;
          this.updateSuccess = true;
          this.showUpdateForm = false;
          setTimeout(() => (this.updateSuccess = false), 3000);
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Update failed.';
          this.updating = false;
        },
      });
  }

  // ─── Direct Close (Audit Team) ────────────────────────────────────────────

  submitClose(): void {
    if (this.closeForm.invalid || !this.observation) return;
    this.closing = true;
    const v = this.closeForm.value;
    this.auditService
      .closeObservation(this.observation.observationId, v.closure_date, v.closure_remarks)
      .subscribe({
        next: (updated) => {
          this.observation = updated;
          this.closing = false;
          this.closeSuccess = true;
          this.showCloseForm = false;
          setTimeout(() => (this.closeSuccess = false), 3000);
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Close operation failed.';
          this.closing = false;
        },
      });
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  deleteObservation(): void {
    if (!this.observation) return;
    if (!confirm(`Delete observation ${this.observation.observationNumber}? This cannot be undone.`)) return;
    this.deleting = true;
    this.auditService.deleteObservation(this.observation.observationId).subscribe({
      next: () => this.router.navigate(['/audit-car/observations/list']),
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Delete failed.';
        this.deleting = false;
      },
    });
  }

  // ─── UI helpers ───────────────────────────────────────────────────────────

  goBack(): void { this.router.navigate(['/audit-car/observations/list']); }

  getStatusClass(status: string): string { return this.auditService.getStatusBadgeClass(status); }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as AuditRiskRating);
  }

  getDaysRemaining(date: string): number { return this.auditService.getDaysRemaining(date); }

  getEvidenceUrl(fileId: number): string { return this.auditService.getEvidenceDownloadUrl(fileId); }

  get effectiveTargetDate(): string {
    if (!this.observation) return '';
    return this.observation.updatedTargetDate1 || this.observation.initialTargetDate || '';
  }

  get isOverdue(): boolean {
    if (!this.observation) return false;
    if (this.observation.status === 'Closed') return false;
    const target = this.effectiveTargetDate;
    return target ? new Date(target) < new Date() : false;
  }

  get isClosed(): boolean { return this.observation?.status === 'Closed'; }

  get isPendingAuditor(): boolean { return this.observation?.status === 'Request Closure'; }

  fileSizeKb(bytes: number): string { return (bytes / 1024).toFixed(1); }
}
