import { Component, OnDestroy, OnInit } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-employees-modal',
    templateUrl: './employees-modal.component.html',
    styleUrl: './employees-modal.component.scss',
    imports: [CommonModule,BsDatepickerModule,MatSelectModule,RouterLink]
})
export class EmployeesModalComponent implements OnInit, OnDestroy{
  values: string[] = ['Jerald', 'Andrew', 'Philip', 'Davis'];
  values2: string[] = ['Hendry', 'James'];
  values3: string[] = ['Dwight'];
  dropdownOpen = false;
  public routes = routes;
  selectedTime: Date = new Date();
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  selectedFieldSet: number[] = [0];
  selectedFieldSet2: number[] = [0];
  isOpen = false
  openSuccessModal() {
    this.isOpen = !this.isOpen;
  }

  nextStep() {
    if (this.selectedFieldSet[0] < 13) {
      this.selectedFieldSet[0]++;
    }
  }
  previousStep() {
    if (this.selectedFieldSet[0] > 0) {
      // Move to the previous step
      this.selectedFieldSet[0]--;
    }
  }
  nextStep2() {
    if (this.selectedFieldSet2[0] < 13) {
      this.selectedFieldSet2[0]++;
    }
  }
  previousStep2() {
    if (this.selectedFieldSet2[0] > 0) {
      // Move to the previous step
      this.selectedFieldSet2[0]--;
    }
  }
    // Open the dropdown
    openDropdown() {
      this.dropdownOpen = true;
    }

    // Close the dropdown
    closeDropdown() {
      this.dropdownOpen = false;
    }

    // Update displayed time when selection changes
    onTimeChange() {
      this.closeDropdown(); // Close dropdown after time selection
    }
  ngOnInit(): void {

    this.editor = new Editor();
  }
  ngOnDestroy(): void {
    this.isOpen = false
    this.editor.destroy();
  }
  public password: boolean[] = [false,false,false,false];
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
}