import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { breadCrumbItems } from '../../../../../core/models/models';

import { RouterLink } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-all-blogs',
    templateUrl: './all-blogs.component.html',
    styleUrl: './all-blogs.component.scss',
    imports: [RouterLink, BsDatepickerModule, FormsModule, CollapseHeaderComponent, BreadcrumbsComponent]
})
export class AllBlogsComponent {
public routes=routes;
breadCrumbItems: breadCrumbItems[] =[];
bsValue = new Date();
bsRangeValue: Date[];
maxDate = new Date();
values1: string[] = ['Sidebar','Header','Footer'];
constructor(){
  this.breadCrumbItems = [
    { label: 'Blogs' },
    { label: 'Blog', active: true }
];
this.maxDate.setDate(this.maxDate.getDate() + 7);
this.bsRangeValue = [this.bsValue, this.maxDate];

}
}
