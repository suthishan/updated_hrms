import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink, RouterModule } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
    selector: 'app-employee-details',
    templateUrl: './employee-details.component.html',
    styleUrl: './employee-details.component.scss',
    imports: [RouterModule, CollapseHeaderComponent, RouterLink]
})
export class EmployeeDetailsComponent {
 public routes=routes;
}
