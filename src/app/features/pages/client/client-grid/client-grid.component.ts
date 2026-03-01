import { Component, OnDestroy } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';
import { routes } from '../../../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-client-grid',
    templateUrl: './client-grid.component.html',
    styleUrl: './client-grid.component.scss',
    imports:[CommonModule,RouterLink,CollapseHeaderComponent,BreadcrumbsComponent,]
})
export class ClientGridComponent implements OnDestroy{
  public password: boolean[] = [false,false,false,false];
  isOpen = false
  public routes = routes;
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Client' },
      { label: 'Client Grid', active: true }
  ];
}
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  openSuccessModal() {
    this.isOpen = !this.isOpen;
  }
  ngOnDestroy(): void {
    this.isOpen = false
  }
}
