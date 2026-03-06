import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { breadCrumbItems, PackagingFile } from '../../../../core/models/models';

@Component({
  selector: 'app-upload-creative',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BreadcrumbsComponent],
  templateUrl: './upload-creative.component.html',
  styleUrl: './upload-creative.component.scss'
})
export class UploadCreativeComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] = [
    { label: 'Packaging Portal' },
    { label: 'Upload Creative', active: true }
  ];

  uploadForm!: FormGroup;
  uploadedFiles: PackagingFile[] = [];
  isDragOver = false;
  validationError = '';
  successMessage = '';
  isSubmitting = false;

  private readonly ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg'];
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      batchRef: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) this.processFiles(Array.from(files));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(Array.from(input.files));
  }

  processFiles(files: File[]): void {
    this.validationError = '';
    for (const file of files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.validationError = `"${file.name}" is not allowed. Only PDF and JPEG files are accepted.`;
        continue;
      }
      if (file.size > this.MAX_FILE_SIZE) {
        this.validationError = `"${file.name}" exceeds the 10MB size limit.`;
        continue;
      }
      if (this.uploadedFiles.find(f => f.name === file.name)) {
        this.validationError = `"${file.name}" is already uploaded.`;
        continue;
      }
      const packagingFile: PackagingFile = {
        id: `F${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        type: file.type === 'application/pdf' ? 'pdf' : 'jpeg',
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };
      this.uploadedFiles.push(packagingFile);
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileIcon(type: string): string {
    return type === 'pdf' ? 'ti ti-file-type-pdf' : 'ti ti-file-type-jpg';
  }

  getFileIconColor(type: string): string {
    return type === 'pdf' ? 'text-danger' : 'text-warning';
  }

  onSubmit(): void {
    this.validationError = '';
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }
    if (this.uploadedFiles.length === 0) {
      this.validationError = 'Please upload at least one packaging creative file (PDF or JPEG).';
      return;
    }
    this.isSubmitting = true;
    // Simulate save — in real app, call backend API
    setTimeout(() => {
      this.isSubmitting = false;
      this.successMessage = 'Creative uploaded successfully! Proceed to configure approvers.';
      setTimeout(() => {
        this.router.navigate(['/pages/packaging/select-approvers']);
      }, 1500);
    }, 1200);
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.uploadForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}
