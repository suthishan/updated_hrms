import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrl: './starter.component.scss',
    imports: [FooterComponent, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class StarterComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Starter', active: true }
  ];
}
}
