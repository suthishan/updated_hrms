import { Component } from '@angular/core';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { RouterModule } from '@angular/router';
import { EmployeesModalComponent } from './employees-modal/employees-modal.component';

@Component({
  selector: 'app-employees',
  imports: [FooterComponent,RouterModule,EmployeesModalComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

}
