import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { CommonService } from '../../../../core/services/common/common.service';

import { RouterModule } from '@angular/router';
@Component({
    selector: 'app-app-settings',
    templateUrl: './app-settings.component.html',
    styleUrl: './app-settings.component.scss',
    imports: [RouterModule]
})
export class AppSettingsComponent {
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
