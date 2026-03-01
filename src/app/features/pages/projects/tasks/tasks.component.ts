import { routes } from './../../../../core/routes/routes';
import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { TaskTabContentComponent } from './task-tab-content/task-tab-content.component';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.scss',
    imports: [TaskTabContentComponent, RouterLink, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class TasksComponent {
  public routes = routes
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Task', active: true }
  ];
}
}
