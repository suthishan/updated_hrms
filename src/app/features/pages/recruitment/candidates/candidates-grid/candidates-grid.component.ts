import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { apiResultFormat, breadCrumbItems, CandidateInfo } from '../../../../../core/models/models';
import { DataService } from '../../../../../core/services/data/data.service';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';

@Component({
    selector: 'app-candidates-grid',
    templateUrl: './candidates-grid.component.html',
    styleUrl: './candidates-grid.component.scss',
    imports : [BreadcrumbsComponent,CollapseHeaderComponent,
      DateRangePickerComponent,
      RouterModule,CommonModule,MatSelectModule,MatSortModule]
})
export class CandidatesGridComponent {
  public routes = routes;
  public actualData: CandidateInfo[] = [];
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(
    private data: DataService,
  ) {
    this.breadCrumbItems = [
      { label: 'Recruitment' },
      { label: 'Candidates Grid', active: true }
  ];
    this.data.getCandidatesList().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
    });
  }
}
