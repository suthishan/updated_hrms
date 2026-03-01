import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss',
    imports: [FooterComponent, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class PrivacyPolicyComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Privacy Policy', active: true }
  ];
}
}
