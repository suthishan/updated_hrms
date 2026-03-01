import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-under-maintenance',
    templateUrl: './under-maintenance.component.html',
    styleUrl: './under-maintenance.component.scss',
    imports: [RouterLink]
})
export class UnderMaintenanceComponent {
routes = routes
}
