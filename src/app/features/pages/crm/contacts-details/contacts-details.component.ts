import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { RouterModule } from '@angular/router';
import { ContactsDetailsModalComponent } from '../contacts-details-modal/contacts-details-modal.component';

@Component({
    selector: 'app-contacts-details',
    templateUrl: './contacts-details.component.html',
    styleUrl: './contacts-details.component.scss',
    imports: [RouterModule,ContactsDetailsModalComponent]
})
export class ContactsDetailsComponent {
routes = routes
}
