import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-knowledgebase-details',
    templateUrl: './knowledgebase-details.component.html',
    styleUrl: './knowledgebase-details.component.scss',
    imports: [CollapseHeaderComponent,DateRangePickerComponent,RouterLink]
})
export class KnowledgebaseDetailsComponent {
routes= routes
}
