import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../core/models/models';
import { CommonService } from '../../../core/services/common/common.service';
import { routes } from '../../../core/routes/routes';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { CollapseHeaderComponent } from '../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../shared/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../../../layouts/footer/footer.component';
import { filter } from 'rxjs';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    imports: [RouterModule, CollapseHeaderComponent, BreadcrumbsComponent, FooterComponent]
})
export class SettingsComponent {
  base = '';
  page = '';
  last = '';
  breadCrumbItems: breadCrumbItems[] =[];
  routes = routes
  constructor(private common: CommonService,private router:Router) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
   
    if (this.page === 'general-settings') {
      

        this.breadCrumbItems = [
          { label: 'General Settings' },
          { label: this.last, active: true }
        ];
      }
}
private setBreadcrumbs(url: string): void {
  const segments = url.split('/').filter(Boolean);

  this.base = segments[0];
  this.page = segments[1];
  this.last = segments[2];

  if (!this.page) {
    this.breadCrumbItems = [];
    return;
  }

  const formattedLabel1 = this.page
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const formattedLabel = this.last
    ? this.last
        .replace(/-settings$/i, '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

  this.breadCrumbItems = [
    { label: formattedLabel1 },
    ...(formattedLabel ? [{ label: formattedLabel, active: true }] : [])
  ];
}

ngOnInit(): void {

  // ✅ 1. Handle PAGE RELOAD
  this.setBreadcrumbs(this.router.url);

  // ✅ 2. Handle ROUTE CHANGES
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.setBreadcrumbs(event.urlAfterRedirects);
    });
}
}
