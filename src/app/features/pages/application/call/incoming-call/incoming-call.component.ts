import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
@Component({
    selector: 'app-incoming-call',
    templateUrl: './incoming-call.component.html',
    styleUrl: './incoming-call.component.scss',
    imports: [CollapseHeaderComponent, BreadcrumbsComponent, NgScrollbarModule]
})
export class IncomingCallComponent {
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
      { label: 'Application' },
      { label: 'Incoming Calls', active: true }
  ];
  }
}
