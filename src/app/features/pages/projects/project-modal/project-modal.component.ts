import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { routes } from '../../../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TagInputModule } from 'ngx-chips';
@Component({
    selector: 'app-project-modal',
    templateUrl: './project-modal.component.html',
    styleUrl: './project-modal.component.scss',
    imports: [CommonModule,RouterLink,MatSelectModule,FormsModule,BsDatepickerModule,TagInputModule,NgxEditorModule]
})
export class ProjectModalComponent implements OnInit, OnDestroy{
  values: string[] = ['Jerald', 'Andrew', 'Philip', 'Davis'];
  values2: string[] = ['Hendry', 'James'];
  values3: string[] = ['Dwight'];
  values4: string[] = ['Collab','Promotion','Rated'];
  dropdownOpen = false;
  dropdownOpen1 = false;
  public routes = routes;
  selectedTime: Date = new Date();
  editor!: Editor;
  editor1!: Editor;
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
    openDropdown1() {
      this.dropdownOpen1 = true;
    }

    // Close the dropdown
    closeDropdown() {
      this.dropdownOpen = false;
    }
    closeDropdown1() {
      this.dropdownOpen1 = false;
    }

    // Update displayed time when selection changes
    onTimeChange() {
      this.closeDropdown(); // Close dropdown after time selection
    }
    onTimeChange1() {
      this.closeDropdown1(); // Close dropdown after time selection
    }
  ngOnInit(): void {

    this.editor = new Editor();
    this.editor1 = new Editor();
  }
  ngOnDestroy(): void {
    this.isOpen = false
    this.editor.destroy();
    this.editor1.destroy();
  }
}
