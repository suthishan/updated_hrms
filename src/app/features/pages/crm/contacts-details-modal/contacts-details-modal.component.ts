import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-contacts-details-modal',
    templateUrl: './contacts-details-modal.component.html',
    styleUrl: './contacts-details-modal.component.scss',
    imports: [MatSelectModule,BsDatepickerModule,RouterLink]
})
export class ContactsDetailsModalComponent {
public routes=routes;
}
