import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../core/models/models';

import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-project-grid',
    templateUrl: './project-grid.component.html',
    styleUrl: './project-grid.component.scss',
    imports: [CollapseHeaderComponent, RouterLink, BreadcrumbsComponent]
})
export class ProjectGridComponent {
  public routes = routes
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Projects Grid', active: true }
  ];
}
}
