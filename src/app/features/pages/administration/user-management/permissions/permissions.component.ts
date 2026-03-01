import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrl: './permissions.component.scss',
    imports: [FormsModule, MatSelectModule, RouterLink, CollapseHeaderComponent]
})
export class PermissionsComponent {
routes = routes
}
