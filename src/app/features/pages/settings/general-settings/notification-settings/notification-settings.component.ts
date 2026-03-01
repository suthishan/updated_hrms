import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-notification-settings',
    templateUrl: './notification-settings.component.html',
    styleUrl: './notification-settings.component.scss',
    imports: [RouterLink]
})
export class NotificationSettingsComponent {
routes = routes
}
