import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-voice-call',
    templateUrl: './voice-call.component.html',
    styleUrl: './voice-call.component.scss',
    imports: [CollapseHeaderComponent, BreadcrumbsComponent]
})
export class VoiceCallComponent {
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
      { label: 'Application' },
      { label: 'Voice Call', active: true }
  ];
  }
}
