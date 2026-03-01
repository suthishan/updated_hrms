import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-invoices-details',
    templateUrl: './invoices-details.component.html',
    styleUrl: './invoices-details.component.scss',
    imports: [RouterLink]
})
export class InvoicesDetailsComponent {
routes = routes
}
