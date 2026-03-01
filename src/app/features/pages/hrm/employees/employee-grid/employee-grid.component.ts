import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-employee-grid',
    templateUrl: './employee-grid.component.html',
    styleUrl: './employee-grid.component.scss',
    imports: [RouterLink, BreadcrumbsComponent, CollapseHeaderComponent, FormsModule]
})
export class EmployeeGridComponent {
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Employee' },
      { label: 'Employee Grid', active: true }
  ];
}

}
