import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditObservation, AuditActionItem, AuditUser } from '../../../../core/models/models';

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
  observationId: string | null = null;
  currentUser: AuditUser | null = null;
  allUsers: AuditUser[] = [];
  responsiblePersonOptions: AuditUser[] = [];
  submitAttempted = false;
  saveSuccess = false;

  riskRatings = ['High', 'Medium', 'Low', 'Improvement'];
  auditAreas = [
    'Procurement', 'Finance', 'IT Security', 'IT Operations', 'HR', 'Operations',
    'Logistics', 'Quality Control', 'Compliance', 'Legal', 'Admin',
  ];
  divisions = [
    'Supply Chain', 'Finance & Accounts', 'Information Technology', 'Human Resources',
    'Poultry Operations', 'Aquaculture', 'Feed Business', 'Corporate', 'Legal & Compliance',
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditCarService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      auditYear: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
      auditArea: ['', Validators.required],
      division: ['', Validators.required],
      riskRating: ['', Validators.required],
      observation: ['', [Validators.required, Validators.minLength(10)]],
      detailsOfFindings: ['', [Validators.required, Validators.minLength(20)]],
      managementCommitment: ['', Validators.required],
      actionItems: this.fb.array([this.createActionItemGroup()]),
    });
  }

  createActionItemGroup(ai?: Partial<AuditActionItem>): FormGroup {
    return this.fb.group({
      responsiblePersonId: [ai?.responsiblePersonId ?? '', Validators.required],
      initialTargetDate: [ai?.initialTargetDate ?? '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.auditService.getCurrentUser();
    this.auditService.getUsers().subscribe((res) => {
      this.allUsers = res.data;
      this.responsiblePersonOptions = res.data.filter((u) => u.role === 'Responsible Person');
    });

    this.observationId = this.route.snapshot.paramMap.get('id');
    if (this.observationId) {
      this.isEditMode = true;
      this.auditService.getObservationById(this.observationId).subscribe((obs) => {
        if (obs) this.patchForm(obs);
      });
    }
  }

  patchForm(obs: AuditObservation): void {
    this.form.patchValue({
      auditYear: obs.auditYear,
      auditArea: obs.auditArea,
      division: obs.division,
      riskRating: obs.riskRating,
      observation: obs.observation,
      detailsOfFindings: obs.detailsOfFindings,
      managementCommitment: obs.managementCommitment,
    });
    this.actionItems.clear();
    obs.actionItems.forEach((ai) => {
      this.actionItems.push(this.createActionItemGroup(ai));
    });
  }

  get actionItems(): FormArray {
    return this.form.get('actionItems') as FormArray;
  }

  getActionItemGroup(index: number): FormGroup {
    return this.actionItems.at(index) as FormGroup;
  }

  addActionItem(): void {
    this.actionItems.push(this.createActionItemGroup());
  }

  removeActionItem(index: number): void {
    if (this.actionItems.length > 1) {
      this.actionItems.removeAt(index);
    }
  }

  getSelectedUser(id: string): AuditUser | undefined {
    return this.allUsers.find((u) => u.id === id);
  }

  onSubmit(publish = false): void {
    this.submitAttempted = true;
    if (this.form.invalid) return;

    const formVal = this.form.value;
    const year: number = formVal.auditYear;
    const obsId = this.isEditMode && this.observationId
      ? this.observationId
      : this.auditService.generateObservationId(year);

    const actionItems: AuditActionItem[] = formVal.actionItems.map((ai: { responsiblePersonId: string; initialTargetDate: string }, idx: number) => {
      const user = this.getSelectedUser(ai.responsiblePersonId);
      return {
        id: this.auditService.generateActionItemId(obsId, idx + 1),
        observationId: obsId,
        responsiblePersonId: ai.responsiblePersonId,
        responsiblePersonName: user?.name ?? '',
        responsiblePersonEmail: user?.email ?? '',
        department: user?.department ?? '',
        division: user?.division ?? '',
        initialTargetDate: ai.initialTargetDate,
        currentTargetDate: ai.initialTargetDate,
        status: 'Not Due' as const,
        followUps: [],
        targetDateRevisions: [],
      };
    });

    const observation: AuditObservation = {
      id: this.isEditMode ? this.observationId! : String(Date.now()),
      observationId: obsId,
      auditYear: year,
      auditArea: formVal.auditArea,
      division: formVal.division,
      riskRating: formVal.riskRating,
      observation: formVal.observation,
      detailsOfFindings: formVal.detailsOfFindings,
      managementCommitment: formVal.managementCommitment,
      overallStatus: 'Open',
      createdBy: this.currentUser?.id ?? '',
      createdByName: this.currentUser?.name ?? '',
      createdDate: new Date().toISOString().split('T')[0],
      publishedDate: publish ? new Date().toISOString().split('T')[0] : undefined,
      isPublished: publish,
      actionItems,
    };

    this.auditService.saveObservation(observation).subscribe(() => {
      this.saveSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/audit-car/observations/list']);
      }, 1200);
    });
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || this.submitAttempted));
  }

  isAiFieldInvalid(index: number, field: string): boolean {
    const ctrl = this.getActionItemGroup(index).get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || this.submitAttempted));
  }

  cancel(): void {
    this.router.navigate(['/audit-car/observations/list']);
  }
}
