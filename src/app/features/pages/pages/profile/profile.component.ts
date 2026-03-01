import { Component } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    imports: [CommonModule,FooterComponent,MatSelectModule,CollapseHeaderComponent,BreadcrumbsComponent]
})
export class ProfileComponent {
  breadCrumbItems: breadCrumbItems[] =[];
  public password: boolean[] = [false,false,false];
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  constructor() {
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Profile', active: true }
  ];
}
}
