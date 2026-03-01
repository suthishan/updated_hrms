import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
    imports: [FooterComponent, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class TimelineComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Timeline', active: true }
  ];
}
}
