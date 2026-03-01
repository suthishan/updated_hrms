import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { apiResultFormat, breadCrumbItems, JobsInfo } from '../../../../../core/models/models';
import { DataService } from '../../../../../core/services/data/data.service';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';

@Component({
    selector: 'app-jobs-grid',
    templateUrl: './jobs-grid.component.html',
    styleUrl: './jobs-grid.component.scss',
    imports: [BreadcrumbsComponent, CollapseHeaderComponent, RouterLink, DateRangePickerComponent]
})
export class JobsGridComponent {
  public routes = routes;
  public actualData: JobsInfo[] = [];
  breadCrumbItems: breadCrumbItems[] =[];
  constructor(
    private data: DataService,
  ) {
    this.breadCrumbItems = [
      { label: 'Recruitment' },
      { label: 'Job Grid', active: true }
  ];
    this.data.getJobList().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
    });
  }

}
