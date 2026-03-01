import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-terms-condition',
    templateUrl: './terms-condition.component.html',
    styleUrl: './terms-condition.component.scss',
    imports: [FooterComponent, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class TermsConditionComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Terms & Conditions', active: true }
  ];
}
}
