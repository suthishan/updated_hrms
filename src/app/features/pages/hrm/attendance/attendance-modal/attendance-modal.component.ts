
import { Component, HostListener, ViewChild } from '@angular/core';
import { BsDatepickerDirective, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-attendance-modal',
    templateUrl: './attendance-modal.component.html',
    styleUrl: './attendance-modal.component.scss',
    imports: [RouterModule, BsDatepickerModule, FormsModule, MatSelectModule, DatePickerModule]
})
export class AttendanceModalComponent {
  addtime: Date[] = [new Date()];
  selectedTime: Date = new Date(); 
  dropdownOpen = false;
  dropdownOpen1 = false;
  dropdownOpen2 = false;
  time: Date[] | undefined;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker?: BsDatepickerDirective;
  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker?.hide();
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
   // Open the dropdown
   openDropdown1() {
    this.dropdownOpen1 = true;
  }

  // Close the dropdown
  closeDropdown1() {
    this.dropdownOpen1 = false;
  }

  // Update displayed time when selection changes
  onTimeChange1() {
    this.closeDropdown1(); // Close dropdown after time selection
  }

     // Open the dropdown
     openDropdown2() {
      this.dropdownOpen2 = true;
    }
  
    // Close the dropdown
    closeDropdown2() {
      this.dropdownOpen2 = false;
    }
  
    // Update displayed time when selection changes
    onTimeChange2() {
      this.closeDropdown2(); // Close dropdown after time selection
    }

}
