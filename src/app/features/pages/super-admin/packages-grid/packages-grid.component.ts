import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../core/models/models';

import { MatSelectModule } from '@angular/material/select';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-packages-grid',
    templateUrl: './packages-grid.component.html',
    styleUrl: './packages-grid.component.scss',
    imports: [MatSelectModule, CollapseHeaderComponent, RouterLink, BreadcrumbsComponent, RouterLink]
})
export class PackagesGridComponent {
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Super Admin' },
      { label: 'Purchase Transaction List', active: true }
  ];
}
}
