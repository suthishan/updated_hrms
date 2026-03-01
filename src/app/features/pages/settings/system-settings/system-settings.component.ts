import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { CommonService } from '../../../../core/services/common/common.service';

import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-system-settings',
    templateUrl: './system-settings.component.html',
    styleUrl: './system-settings.component.scss',
    imports: [RouterModule]
})
export class SystemSettingsComponent {
  base = '';
  page = '';
  last = '';
  routes = routes
  constructor(private common: CommonService) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
}
}
