import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { RouterModule } from '@angular/router';
import { ContactsDetailsModalComponent } from '../contacts-details-modal/contacts-details-modal.component';

@Component({
    selector: 'app-company-details',
    templateUrl: './company-details.component.html',
    styleUrl: './company-details.component.scss',
    imports: [RouterModule,ContactsDetailsModalComponent]
})
export class CompanyDetailsComponent {
routes = routes
}
