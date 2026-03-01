import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../../core/models/models';

import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BreadcrumbsComponent } from '../../../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../../../shared/collapse-header/collapse-header.component';
@Component({
    selector: 'app-leave-settings',
    templateUrl: './leave-settings.component.html',
    styleUrl: './leave-settings.component.scss',
    imports: [RouterModule, BsDatepickerModule, BreadcrumbsComponent, CollapseHeaderComponent]  
})
export class LeaveSettingsComponent {
  public routes = routes;
  initChecked = false;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(){
    this.breadCrumbItems = [
            { label: 'Attendance' },
            { label: 'Leave Settings', active: true }
        ];
  }
}
