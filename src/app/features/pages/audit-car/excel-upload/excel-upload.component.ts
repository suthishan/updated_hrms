import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditUploadHistory, AuditUser } from '../../../../core/models/models';

interface ParsedRow {
  auditYear: string;
  auditArea: string;
  division: string;
  observation: string;
  riskRating: string;
  detailsOfFindings: string;
  managementCommitment: string;
  responsiblePerson: string;
  initialTargetDate: string;
  status: string;
  valid: boolean;
  errors: string[];
}

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './excel-upload.component.html',
  styleUrl: './excel-upload.component.scss',
})
export class ExcelUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadHistory: AuditUploadHistory[] = [];
  currentUser: AuditUser | null = null;

  // Upload state
  dragOver = false;
  selectedFile: File | null = null;
  parsedRows: ParsedRow[] = [];
  uploadStep: 'idle' | 'preview' | 'uploading' | 'done' = 'idle';
  uploadResult: { success: number; errors: number } | null = null;

  // Template columns
  templateColumns = [
    'Audit Year', 'Audit Area', 'Division', 'Observation', 'Risk Rating',
    'Details of Findings', 'Follow-up Commitment from Management',
    'Responsible Personnel', 'Initial Target Date',
    'Subsequent Follow Up 1', 'Updated Target Date 1', 'Status',
    'Subsequent Follow Up 2', 'Updated Target Date 2', 'Auditor Closure Comment',
    'Management Comment',
  ];

  validRatings = new Set(['High', 'Medium', 'Low', 'Improvement']);
  validStatuses = new Set(['Not Due', 'Overdue', 'Partially Open', 'Request Closure', 'Closed', 'Open']);

  constructor(private auditService: AuditCarService) {}

  ngOnInit(): void {
    this.currentUser = this.auditService.getCurrentUser();
    this.loadHistory();
  }

  loadHistory(): void {
    this.auditService.getUploadHistory().subscribe((res) => (this.uploadHistory = res.data));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  processFile(file: File): void {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(xlsx?|csv)$/i)) {
      alert('Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    this.selectedFile = file;

    if (file.name.endsWith('.csv') || file.type === 'text/csv') {
      this.parseCsvFile(file);
    } else {
      // For Excel files, show mock parsed data (real parsing requires SheetJS)
      this.parsedRows = this.getMockParsedRows();
      this.uploadStep = 'preview';
    }
  }

  parseCsvFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        this.parsedRows = [];
        this.uploadStep = 'preview';
        return;
      }
      const rows = lines.slice(1).map((line) => {
        const cols = this.parseCsvLine(line);
        return this.validateRow({
          auditYear: cols[0] ?? '',
          auditArea: cols[1] ?? '',
          division: cols[2] ?? '',
          observation: cols[3] ?? '',
          riskRating: cols[4] ?? '',
          detailsOfFindings: cols[5] ?? '',
          managementCommitment: cols[6] ?? '',
          responsiblePerson: cols[7] ?? '',
          initialTargetDate: cols[8] ?? '',
          status: cols[11] ?? 'Not Due',
          valid: true,
          errors: [],
        });
      });
      this.parsedRows = rows;
      this.uploadStep = 'preview';
    };
    reader.readAsText(file);
  }

  parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += char; }
    }
    result.push(current.trim());
    return result;
  }

  validateRow(row: ParsedRow): ParsedRow {
    const errors: string[] = [];
    if (!row.auditYear || isNaN(Number(row.auditYear))) errors.push('Invalid Audit Year');
    if (!row.auditArea) errors.push('Audit Area required');
    if (!row.division) errors.push('Division required');
    if (!row.observation) errors.push('Observation required');
    if (!this.validRatings.has(row.riskRating)) errors.push(`Invalid Risk Rating: "${row.riskRating}"`);
    if (!row.responsiblePerson) errors.push('Responsible Personnel required');
    if (!row.initialTargetDate || isNaN(Date.parse(row.initialTargetDate))) errors.push('Invalid Initial Target Date');
    if (row.status && !this.validStatuses.has(row.status)) errors.push(`Invalid Status: "${row.status}"`);
    return { ...row, valid: errors.length === 0, errors };
  }

  getMockParsedRows(): ParsedRow[] {
    return [
      this.validateRow({
        auditYear: '2024', auditArea: 'Procurement', division: 'Supply Chain',
        observation: 'Contract management process gaps',
        riskRating: 'Medium', detailsOfFindings: 'Contracts not reviewed periodically.',
        managementCommitment: 'Will implement quarterly contract review.',
        responsiblePerson: 'Anjali Sharma', initialTargetDate: '2024-09-30',
        status: 'Not Due', valid: true, errors: [],
      }),
      this.validateRow({
        auditYear: '2024', auditArea: 'Finance', division: 'Finance & Accounts',
        observation: 'Invoice approval workflow not documented',
        riskRating: 'Low', detailsOfFindings: 'No SOP for invoice approval.',
        managementCommitment: 'SOP will be documented.',
        responsiblePerson: 'Meena Pillai', initialTargetDate: '2024-08-31',
        status: 'Not Due', valid: true, errors: [],
      }),
      this.validateRow({
        auditYear: '2024', auditArea: 'IT Security', division: 'Information Technology',
        observation: 'Patch management policy outdated',
        riskRating: 'Critical', // Invalid - should trigger error
        detailsOfFindings: 'Server patches are not applied monthly.',
        managementCommitment: 'Monthly patch schedule will be enforced.',
        responsiblePerson: 'Suresh Babu', initialTargetDate: 'invalid-date',
        status: 'Not Due', valid: true, errors: [],
      }),
    ].map((r) => this.validateRow(r));
  }

  get validRowCount(): number {
    return this.parsedRows.filter((r) => r.valid).length;
  }

  get errorRowCount(): number {
    return this.parsedRows.filter((r) => !r.valid).length;
  }

  confirmUpload(): void {
    if (!this.validRowCount) return;
    this.uploadStep = 'uploading';
    // Simulate upload delay
    setTimeout(() => {
      this.uploadResult = { success: this.validRowCount, errors: this.errorRowCount };
      this.uploadStep = 'done';
      this.loadHistory();
    }, 1500);
  }

  resetUpload(): void {
    this.selectedFile = null;
    this.parsedRows = [];
    this.uploadStep = 'idle';
    this.uploadResult = null;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  downloadTemplate(): void {
    const header = this.templateColumns.join(',');
    const sampleRow = [
      '2024', 'Procurement', 'Supply Chain', 'Vendor due diligence gaps', 'High',
      'Vendor DD not performed for 3 new suppliers.', 'Implement DD checklist.',
      'Anjali Sharma', '2024-09-30', '', '', 'Not Due', '', '', '', '',
    ].map((v) => `"${v}"`).join(',');
    const csv = [header, sampleRow].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Audit_CAR_Upload_Template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Success': 'badge-soft-success', 'Partial': 'badge-soft-warning', 'Failed': 'badge-soft-danger',
    };
    return map[status] ?? 'badge-soft-secondary';
  }
}
