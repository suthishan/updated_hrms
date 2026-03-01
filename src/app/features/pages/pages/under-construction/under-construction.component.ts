import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-under-construction',
    templateUrl: './under-construction.component.html',
    styleUrl: './under-construction.component.scss',
    imports: [RouterLink]
})
export class UnderConstructionComponent {
routes= routes
}
