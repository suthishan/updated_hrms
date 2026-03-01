import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';

import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import { DateRangePickerComponent } from '../../../../shared/date-range-picker/date-range-picker.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrl: './todo-list.component.scss',
    imports: [MatSelectModule, FooterComponent, BsDatepickerModule, NgxEditorModule, DateRangePickerComponent, CollapseHeaderComponent, RouterLink]
})
export class TodoListComponent {
routes = routes
}
