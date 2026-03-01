import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrl: './profile-settings.component.scss',
    imports: [MatSelectModule, RouterLink],
})
export class ProfileSettingsComponent {
routes = routes
}
