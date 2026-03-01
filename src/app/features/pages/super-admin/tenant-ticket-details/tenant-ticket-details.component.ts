import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { routes } from '../../../../core/routes/routes';

@Component({
  selector: 'app-tenant-ticket-details',
  imports: [MatSelectModule,TagInputModule,FormsModule,RouterLink],
  templateUrl: './tenant-ticket-details.component.html',
  styleUrl: './tenant-ticket-details.component.scss',
})
export class TenantTicketDetailsComponent {
  routes = routes
  values: string[] = ['Vaughan Lewis'];
}
