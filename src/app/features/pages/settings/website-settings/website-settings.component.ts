import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { CommonService } from '../../../../core/services/common/common.service';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-website-settings',
    templateUrl: './website-settings.component.html',
    styleUrl: './website-settings.component.scss',
    imports: [RouterModule]
})
export class WebsiteSettingsComponent {
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
