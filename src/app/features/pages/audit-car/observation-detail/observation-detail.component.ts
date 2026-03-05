import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditObservation, AuditRiskRating } from '../../../../core/models/models';

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

  // Update status form
  updateForm: FormGroup;
  showUpdateForm = false;
  updating = false;
  updateSuccess = false;

  // Close form
  closeForm: FormGroup;
  showCloseForm = false;
  closing = false;
  closeSuccess = false;

  // Delete
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditCarService,
    private fb: FormBuilder
  ) {
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
      this.auditService.getObservationById(Number(idParam)).subscribe({
        next: (obs) => {
          this.observation = obs;
          this.loading = false;
          if (obs) {
            this.updateForm.patchValue({
              subsequent_followup_1: obs.subsequentFollowup1 ?? '',
              updated_target_date_1: obs.updatedTargetDate1  ?? '',
              status: obs.status,
            });
          }
        },
        error: (err: Error) => {
          this.errorMsg = err.message ?? 'Failed to load observation.';
          this.loading = false;
        },
      });
    }
  }

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

  goBack(): void {
    this.router.navigate(['/audit-car/observations/list']);
  }

  getStatusClass(status: string): string {
    return this.auditService.getStatusBadgeClass(status);
  }

  getRiskClass(rating: string): string {
    return this.auditService.getRiskBadgeClass(rating as AuditRiskRating);
  }

  getDaysRemaining(date: string): number {
    return this.auditService.getDaysRemaining(date);
  }

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

  get isClosed(): boolean {
    return this.observation?.status === 'Closed';
  }
}
