import { Component, OnDestroy } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import {  breadCrumbItems, contactList } from '../../../../core/models/models';
import { DataService } from '../../../../core/services/data/data.service';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';

import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
interface apiResultFormat {
  data: contactList[]; // Nested array as per your console output
}
@Component({
    selector: 'app-contacts-grid',
    templateUrl: './contacts-grid.component.html',
    styleUrl: './contacts-grid.component.scss',
    imports: [RouterModule, BreadcrumbsComponent, CollapseHeaderComponent]
})
export class ContactsGridComponent implements OnDestroy {
  public routes = routes;
  public actualData: contactList[] = [];
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(
    private data: DataService,
  ) {
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Contacts Grid', active: true }
  ];
    this.data.getContactlist().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
    });
  }
  isOpen = false
  openSuccessModal() {
    this.isOpen = !this.isOpen;
  }
  ngOnDestroy(): void {
    this.isOpen = false
  }
}
