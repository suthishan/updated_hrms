import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-leads-modal',
    templateUrl: './leads-modal.component.html',
    styleUrl: './leads-modal.component.scss',
    imports: [MatSelectModule, FormsModule, TagInputModule],
    
})
export class LeadsModalComponent {
  values:any[] = ['Collab', 'Promotion', 'Rated', 'Davis'];
  values1:any[]=['Vaughan Lewis'];
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
