
import { Component } from '@angular/core';
// interface data {
//   name: string | undefined;
//   code: string | undefined;
// }
@Component({
    selector: 'app-salary-settings',
    templateUrl: './salary-settings.component.html',
    styleUrl: './salary-settings.component.scss',
    imports: []
})
export class SalarySettingsComponent {
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
