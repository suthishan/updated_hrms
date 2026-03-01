import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-outgoing-call',
    templateUrl: './outgoing-call.component.html',
    styleUrl: './outgoing-call.component.scss',
    imports: [CollapseHeaderComponent, BreadcrumbsComponent]
})
export class OutgoingCallComponent {
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
      { label: 'Application' },
      { label: 'Outgoing Calls', active: true }
  ];
  }
}
