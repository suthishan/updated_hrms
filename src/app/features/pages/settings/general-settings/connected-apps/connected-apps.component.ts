import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-connected-apps',
    templateUrl: './connected-apps.component.html',
    styleUrl: './connected-apps.component.scss',
    imports: [RouterLink]
})
export class ConnectedAppsComponent {
routes = routes
}
