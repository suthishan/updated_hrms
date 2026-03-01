import { Component, OnDestroy } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import {  apiResultFormat, breadCrumbItems, Company } from '../../../../core/models/models';
import { DataService } from '../../../../core/services/data/data.service';

import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';

@Component({
    selector: 'app-companies-grid', 
    templateUrl: './companies-grid.component.html',
    styleUrl: './companies-grid.component.scss',
    imports: [RouterModule, BreadcrumbsComponent, CollapseHeaderComponent]
})
export class CompaniesGridComponent implements OnDestroy {
  public routes = routes;
  public actualData: Company[] = [];
  breadCrumbItems: breadCrumbItems[] =[];
  isOpen = false
  openSuccessModal() {
    this.isOpen = !this.isOpen;
  }
  ngOnDestroy(): void {
    this.isOpen = false
  }
  constructor(
    private data: DataService,
  ) {
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Companies Grid', active: true }
  ];
    this.data.getCompany().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
    });
  }
}
