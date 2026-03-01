import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-add-invoice',
    templateUrl: './add-invoice.component.html',
    styleUrl: './add-invoice.component.scss',
    imports: [CommonModule,FormsModule,MatSelectModule,RouterLink,BsDatepickerModule]
})
export class AddInvoiceComponent {
routes= routes
public password: boolean[] = [false,false,false,false];
togglePassword(index: number) {
  this.password[index] = !this.password[index];
}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any[] = []; // Initialize with an empty object to start with one row

  addNewRow() {
    this.formData.push({});
  }

  removeRow(index: number) {
      this.formData.splice(index, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  trackByIndex(index: number, item: any) {
    return index;
  }
}
