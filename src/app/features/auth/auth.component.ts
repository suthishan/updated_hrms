import { Component } from '@angular/core';
import { NavigationStart, Router, Event as RouterEvent, RouterModule } from '@angular/router';
import { CommonService } from '../../core/services/common/common.service';
import { url } from '../../core/models/sidebar.model';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    imports: [RouterModule,CommonModule]
})
export class AuthComponent {
  public themeMode = '';
  base = '';
  page = '';
  last = '';

  constructor(
    private Router: Router,
    private common: CommonService,
  ) {
    this.Router.events.subscribe((data: RouterEvent) => {
      if (data instanceof NavigationStart) {
        this.getRoutes(data);
      }
    });
     this.getRoutes(this.Router);
  }

  private getRoutes(data: url): void {
    const splitVal = data.url.split('/');
    this.base = splitVal[1];
    this.page = splitVal[2];
    this.last = splitVal[3];
    this.common.base.next(splitVal[1]);
    this.common.page.next(splitVal[2]);
    this.common.last.next(splitVal[3]);
  } 
}
