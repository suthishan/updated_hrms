import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuditCarService } from '../services/audit-car.service';
import { AuditObservation, AuditEmployee } from '../../../../core/models/models';

interface AuditAreaOption { id: number; name: string; }
interface DivisionOption  { id: number; name: string; }

/** These IDs must match the seed data in audit-car.sql */
const AUDIT_AREAS: AuditAreaOption[] = [
  { id: 1,  name: 'Procurement' },
  { id: 2,  name: 'Finance' },
  { id: 3,  name: 'IT Security' },
  { id: 4,  name: 'IT Operations' },
  { id: 5,  name: 'Human Resources' },
  { id: 6,  name: 'Operations' },
  { id: 7,  name: 'Logistics' },
  { id: 8,  name: 'Quality Control' },
  { id: 9,  name: 'Compliance' },
  { id: 10, name: 'Legal' },
  { id: 11, name: 'Administration' },
];

const DIVISIONS: DivisionOption[] = [
  { id: 1, name: 'Supply Chain' },
  { id: 2, name: 'Finance & Accounts' },
  { id: 3, name: 'Information Technology' },
  { id: 4, name: 'Human Resources' },
  { id: 5, name: 'Poultry Operations' },
  { id: 6, name: 'Aquaculture' },
  { id: 7, name: 'Feed Business' },
  { id: 8, name: 'Corporate' },
  { id: 9, name: 'Legal & Compliance' },
];

@Component({
  selector: 'app-create-observation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-observation.component.html',
  styleUrl: './create-observation.component.scss',
})
export class CreateObservationComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  observationId: number | null = null;

  // Reference data
  auditAreas = AUDIT_AREAS;
  divisions = DIVISIONS;
  riskRatings = ['High', 'Medium', 'Low', 'Improvement'];
  statusOptions = ['Open', 'Repeated', 'Overdue', 'Closed'];

  // Employee typeahead
  employeeSearch = '';
  employeeResults: AuditEmployee[] = [];
  selectedEmployee: AuditEmployee | null = null;
  private empSearch$ = new Subject<string>();
  empSearching = false;

  submitAttempted = false;
  saving = false;
  saveSuccess = false;
  errorMsg = '';

  // Annexures
  annexureFiles: File[] = [];
  annexureDragOver = false;
  annexureUploadError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditCarService
  ) {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      auditYear:          [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      auditAreaId:        [null as number | null],
      divisionId:         [null as number | null],
      observationTitle:   ['', [Validators.required, Validators.minLength(5)]],
      riskRating:         ['', Validators.required],
      detailsOfFindings:  ['', [Validators.required, Validators.minLength(10)]],
      followupCommitment: ['', Validators.required],
      initialTargetDate:  ['', Validators.required],
      subsequentFollowup1:[''],
      updatedTargetDate1: [''],
      status:             ['Open'],
    });
  }

  ngOnInit(): void {
    // Employee typeahead with debounce
    this.empSearch$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((term) => {
      if (term.length < 2) { this.employeeResults = []; return; }
      this.empSearching = true;
      this.auditService.searchEmployees(term).subscribe({
        next: (list) => { this.employeeResults = list; this.empSearching = false; },
        error: () => { this.employeeResults = []; this.empSearching = false; },
      });
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.observationId = Number(idParam);
      this.auditService.getObservationById(this.observationId).subscribe((obs) => {
        if (obs) this.patchForm(obs);
      });
    }
  }

  private patchForm(obs: AuditObservation): void {
    this.form.patchValue({
      auditYear:          obs.auditYear,
      auditAreaId:        obs.auditAreaId ?? null,
      divisionId:         obs.divisionId ?? null,
      observationTitle:   obs.observationTitle,
      riskRating:         obs.riskRating,
      detailsOfFindings:  obs.detailsOfFindings,
      followupCommitment: obs.followupCommitment,
      initialTargetDate:  obs.initialTargetDate,
      subsequentFollowup1:obs.subsequentFollowup1 ?? '',
      updatedTargetDate1: obs.updatedTargetDate1 ?? '',
      status:             obs.status,
    });
    if (obs.responsiblePerson) {
      this.employeeSearch = obs.responsiblePerson;
      this.selectedEmployee = {
        eid: obs.responsiblePersonId ?? 0,
        emp_name: obs.responsiblePerson,
        emp_code: obs.responsiblePersonCode ?? '',
        emp_email: obs.responsiblePersonEmail,
      };
    }
  }

  onEmployeeSearchInput(): void {
    this.empSearch$.next(this.employeeSearch);
    if (!this.employeeSearch) this.clearEmployee();
  }

  selectEmployee(emp: AuditEmployee): void {
    this.selectedEmployee = emp;
    this.employeeSearch = emp.emp_name;
    this.employeeResults = [];
  }

  clearEmployee(): void {
    this.selectedEmployee = null;
    this.employeeResults = [];
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || this.submitAttempted));
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.errorMsg = '';
    if (this.form.invalid || !this.selectedEmployee) return;

    const v = this.form.value;
    const payload = {
      audit_year:           Number(v.auditYear),
      audit_area_id:        v.auditAreaId || undefined,
      division_id:          v.divisionId  || undefined,
      observation_title:    v.observationTitle,
      risk_rating:          v.riskRating,
      details_of_findings:  v.detailsOfFindings,
      followup_commitment:  v.followupCommitment,
      responsible_person_id: this.selectedEmployee.eid,
      initial_target_date:  v.initialTargetDate,
      subsequent_followup_1: v.subsequentFollowup1 || undefined,
      updated_target_date_1: v.updatedTargetDate1  || undefined,
      status:               v.status || 'Open',
    };

    this.saving = true;
    const request$ = this.isEditMode && this.observationId
      ? this.auditService.updateObservation(this.observationId, {
          audit_area_id:        payload.audit_area_id,
          division_id:          payload.division_id,
          observation_title:    payload.observation_title,
          risk_rating:          payload.risk_rating,
          details_of_findings:  payload.details_of_findings,
          followup_commitment:  payload.followup_commitment,
          responsible_person_id: payload.responsible_person_id,
          initial_target_date:  payload.initial_target_date,
          subsequent_followup_1: payload.subsequent_followup_1,
          updated_target_date_1: payload.updated_target_date_1,
          status:               payload.status,
        })
      : this.auditService.createObservation(payload);

    request$.subscribe({
      next: (saved) => {
        if (this.annexureFiles.length > 0 && saved?.observationId) {
          this.auditService.uploadAnnexures(saved.observationId, this.annexureFiles).subscribe({
            next: () => this.finishSave(),
            error: () => {
              // Annexure upload failed but observation saved — still navigate
              this.annexureUploadError = 'Observation saved but some annexures failed to upload. You can re-upload from the detail page.';
              this.finishSave();
            },
          });
        } else {
          this.finishSave();
        }
      },
      error: (err: Error) => {
        this.saving = false;
        this.errorMsg = err.message ?? 'Save failed. Please try again.';
      },
    });
  }

  private finishSave(): void {
    this.saving = false;
    this.saveSuccess = true;
    setTimeout(() => this.router.navigate(['/audit-car/observations/list']), 1200);
  }

  onAnnexureFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.annexureFiles.push(...Array.from(input.files));
    }
    input.value = '';
  }

  onAnnexureDragOver(event: DragEvent): void {
    event.preventDefault();
    this.annexureDragOver = true;
  }

  onAnnexureDrop(event: DragEvent): void {
    event.preventDefault();
    this.annexureDragOver = false;
    if (event.dataTransfer?.files) {
      this.annexureFiles.push(...Array.from(event.dataTransfer.files));
    }
  }

  removeAnnexure(index: number): void {
    this.annexureFiles.splice(index, 1);
  }

  clearAnnexures(): void {
    this.annexureFiles = [];
  }

  cancel(): void {
    this.router.navigate(['/audit-car/observations/list']);
  }
}
