import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditCarService } from '../services/audit-car.service';
import { AuditBatch, AuditStagingRow, AuditBatchSummary } from '../../../../core/models/models';

type UploadStep = 'idle' | 'uploading' | 'staging' | 'syncing' | 'done' | 'error';

@Component({
  selector: 'app-excel-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './excel-upload.component.html',
  styleUrl: './excel-upload.component.scss',
})
export class ExcelUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Upload flow state
  step: UploadStep = 'idle';
  selectedFile: File | null = null;
  dragOver = false;
  errorMsg = '';

  // After upload step
  currentBatchId = '';
  stagingRows: AuditStagingRow[] = [];
  stagingSummary: AuditBatchSummary | null = null;

  // After sync step
  syncResult: { synced: number; errors: number } | null = null;

  // Batch history
  batches: AuditBatch[] = [];
  batchesLoading = false;

  // Template columns (match backend COLUMN_MAP)
  templateColumns = [
    'Audit Year', 'Audit Area', 'Division', 'Observation',
    'Risk Ratings', 'Details of the findings',
    'Follow-up Commitment from Management', 'Responsible Personnel',
    'Initial Target Date', 'Subsequent Follow Up 1', 'Updated Target Date 1', 'Status',
  ];

  constructor(private auditService: AuditCarService) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.batchesLoading = true;
    this.auditService.getBatches().subscribe({
      next: (batches) => { this.batches = batches; this.batchesLoading = false; },
      error: () => { this.batchesLoading = false; },
    });
  }

  // ─── Drag / Drop / File Select ───────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void { this.dragOver = false; }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File): void {
    const allowed = /\.(xlsx?|csv)$/i;
    if (!allowed.test(file.name)) {
      this.errorMsg = 'Please upload an Excel (.xlsx, .xls) or CSV file.';
      return;
    }
    this.selectedFile = file;
    this.uploadToBackend();
  }

  // ─── Step 1: Upload to staging ────────────────────────────────────────────

  uploadToBackend(): void {
    if (!this.selectedFile) return;
    this.step = 'uploading';
    this.errorMsg = '';
    this.auditService.uploadExcel(this.selectedFile).subscribe({
      next: ({ batchId, totalRows }) => {
        this.currentBatchId = batchId;
        this.loadStagingPreview(batchId, totalRows);
      },
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Upload failed.';
        this.step = 'error';
      },
    });
  }

  private loadStagingPreview(batchId: string, _totalRows: number): void {
    this.step = 'staging';
    this.auditService.getStagingRows(batchId).subscribe({
      next: ({ summary, rows }) => {
        this.stagingSummary = summary;
        this.stagingRows = rows;
      },
      error: () => {
        // Preview failed but batch uploaded — still allow sync
        this.stagingRows = [];
      },
    });
  }

  // ─── Step 2: Sync to master ───────────────────────────────────────────────

  syncBatch(): void {
    this.step = 'syncing';
    this.errorMsg = '';
    this.auditService.syncBatch(this.currentBatchId).subscribe({
      next: (result) => {
        this.syncResult = result;
        this.step = 'done';
        this.loadBatches();
      },
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Sync failed.';
        this.step = 'error';
      },
    });
  }

  retryBatch(): void {
    this.step = 'syncing';
    this.errorMsg = '';
    this.auditService.retryBatch(this.currentBatchId).subscribe({
      next: (result) => {
        this.syncResult = result;
        this.step = 'done';
        this.loadBatches();
      },
      error: (err: Error) => {
        this.errorMsg = err.message ?? 'Retry failed.';
        this.step = 'error';
      },
    });
  }

  reset(): void {
    this.step = 'idle';
    this.selectedFile = null;
    this.currentBatchId = '';
    this.stagingRows = [];
    this.stagingSummary = null;
    this.syncResult = null;
    this.errorMsg = '';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  downloadTemplate(): void {
    const header = this.templateColumns.join(',');
    const sample = [
      '2024', 'Procurement', 'Supply Chain', 'Vendor due diligence gaps', 'High',
      'Vendor DD not performed for 3 suppliers.', 'Implement DD checklist.',
      'John Doe', '2024-09-30', '', '', 'Open',
    ].map((v) => `"${v}"`).join(',');
    const csv = [header, sample].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'Audit_CAR_Upload_Template.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  getSyncStatusClass(status: string): string {
    const map: Record<string, string> = {
      Synced: 'badge-soft-success',
      Error:  'badge-soft-danger',
      Pending: 'badge-soft-warning',
    };
    return map[status] ?? 'badge-soft-secondary';
  }

  getBatchStatusClass(batch: AuditBatch): string {
    if (batch.errors === 0 && Number(batch.synced) > 0) return 'badge-soft-success';
    if (batch.errors > 0 && Number(batch.synced) > 0) return 'badge-soft-warning';
    if (batch.errors > 0 && Number(batch.synced) === 0) return 'badge-soft-danger';
    return 'badge-soft-secondary';
  }

  getBatchStatusLabel(batch: AuditBatch): string {
    if (batch.errors === 0 && Number(batch.synced) > 0) return 'Success';
    if (batch.errors > 0 && Number(batch.synced) > 0) return 'Partial';
    if (batch.errors > 0 && Number(batch.synced) === 0) return 'Failed';
    return 'Pending';
  }

  get pendingCount(): number { return Number(this.stagingSummary?.pending ?? 0); }
  get syncedCount():  number { return Number(this.stagingSummary?.synced  ?? 0); }
  get errorCount():   number { return Number(this.stagingSummary?.error   ?? 0); }
  get totalCount():   number { return Number(this.stagingSummary?.total   ?? 0); }
}
