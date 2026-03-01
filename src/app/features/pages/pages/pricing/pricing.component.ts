import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';

import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrl: './pricing.component.scss',
    imports: [MatSelectModule, FooterComponent, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class PricingComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Pricing', active: true }
  ];
}
}
