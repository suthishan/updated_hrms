import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';
import { MatSelectModule } from '@angular/material/select';

import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-performance-review',
    templateUrl: './performance-review.component.html',
    styleUrl: './performance-review.component.scss',
    imports: [MatSelectModule, BreadcrumbsComponent, CollapseHeaderComponent, FormsModule]
})
export class PerformanceReviewComponent {
  public routes = routes;
  initChecked = false;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
            { label: 'Performance' },
            { label: 'Performance Reviews', active: true }
        ];
  }
}
