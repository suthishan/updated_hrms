import { Component } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-accounting-modal',
    templateUrl: './accounting-modal.component.html',
    styleUrl: './accounting-modal.component.scss',
    imports: [BsDatepickerModule]
})
export class AccountingModalComponent {
  rowappend: { title: string; amount: string }[] = [
    { title: '', amount: '' }
  ];
  rowappend1: { title: string; amount: string }[] = [
    { title: '', amount: '' }
  ];
  rowappend2: { title: string; amount: string }[] = [
    { title: '', amount: '' }
  ];
  rowappend3: { title: string; amount: string }[] = [
    { title: '', amount: '' }
  ];
  addRow(): void {
    this.rowappend.push({ title: '', amount: '' });
  }
  addRow1(): void {
    this.rowappend1.push({ title: '', amount: '' });
  }
  addRow2(): void {
    this.rowappend2.push({ title: '', amount: '' });
  }
  addRow3(): void {
    this.rowappend3.push({ title: '', amount: '' });
  }
  removeRow(index: number): void {
    if (this.rowappend.length > 1) {
      this.rowappend.splice(index, 1); // Prevent removing the last remaining row
    }
  }
  removeRow1(index: number): void {
    if (this.rowappend1.length > 1) {
      this.rowappend1.splice(index, 1); 
    }
  }
  removeRow2(index: number): void {
    if (this.rowappend2.length > 1) {
      this.rowappend2.splice(index, 1); 
    }
  }
  removeRow3(index: number): void {
    if (this.rowappend3.length > 1) {
      this.rowappend3.splice(index, 1); 
    }
  }
}
