import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';

@Component({
    selector: 'app-knowledgebase',
    templateUrl: './knowledgebase.component.html',
    styleUrl: './knowledgebase.component.scss',
    imports: [RouterLink, CollapseHeaderComponent, DateRangePickerComponent]
})
export class KnowledgebaseComponent {
routes = routes
}
