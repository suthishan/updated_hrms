import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

interface data {
  value: string;
}
@Component({
    selector: 'app-form-horizontal',
    templateUrl: './form-horizontal.component.html',
    styleUrl: './form-horizontal.component.scss',
    imports: [MatSelectModule, FormsModule]
})

export class FormHorizontalComponent {
  public routes = routes;
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';

  selectedList1: data[] = [
    { value: 'A+' },
    { value: 'O+' },
    { value: 'B+' },
    { value: 'AB+' },
  ];
  selectedList2: data[] = [
    { value: 'Select State' },
    { value: 'California' },
    { value: 'Texas' },
    { value: 'Florida' },
  ];
  selectedList3: data[] = [
    { value: 'Select Country' },
    { value: 'USA' },
    { value: 'France' },
    { value: 'India' },
    { value: 'Spain' },
  ];
  selectedList4: data[] = [
    { value: 'Choose...' },
    { value: 'One' },
    { value: 'Two' },
    { value: 'Three' },
  ];
  selectedList5: data[] = [
    { value: 'Choose...' },
    { value: 'One' },
    { value: 'Two' },
    { value: 'Three' },
  ];
}
