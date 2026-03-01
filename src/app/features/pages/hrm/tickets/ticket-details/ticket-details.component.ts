import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
    selector: 'app-ticket-details',
    templateUrl: './ticket-details.component.html',
    styleUrl: './ticket-details.component.scss',
    imports: [RouterModule, RouterLink, BsDatepickerModule, MatSelectModule, CollapseHeaderComponent]
})
export class TicketDetailsComponent {
 public routes=routes;
}
