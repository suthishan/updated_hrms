import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { routes } from '../../../../core/routes/routes';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { CommonService } from '../../../../core/services/common/common.service';
import { filter } from 'rxjs';
@Component({
    selector: 'app-base-ui',
    templateUrl: './base-ui.component.html',
    styleUrl: './base-ui.component.scss',
    imports: [RouterModule,FooterComponent]
})
export class BaseUiComponent {
routes = routes 
base = '';
  page = '';
  last = '';
  title ='';
  title2 ='';
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
   
}
private setBreadcrumbs(url: string): void {
  const segments = url.split('/').filter(Boolean);

  this.base = segments[0];
  this.page = segments[1];
  this.last = segments[2];

  if (!this.page) {
    // this.breadCrumbItems = [];
    return;
  }

  const formattedLabel1 = this.base
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const formattedLabel = this.page
    ? this.page
        .replace(/-settings$/i, '')
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

  this.title = formattedLabel1
  this.title2 = formattedLabel
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
