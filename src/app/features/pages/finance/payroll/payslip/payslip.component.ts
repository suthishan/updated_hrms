import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-payslip',
    templateUrl: './payslip.component.html',
    styleUrl: './payslip.component.scss',
    imports: [CollapseHeaderComponent, BreadcrumbsComponent]
})
export class PayslipComponent {
  public routes = routes;
  initChecked = false;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
            { label: 'Payroll' },
            { label: 'Payslip', active: true }
        ];
  }
}
