import { Component } from '@angular/core';

import { RouterModule, RouterOutlet } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    styleUrl: './tickets.component.scss',
    imports: [RouterModule, TagInputModule, MatSelectModule, BsDatepickerModule, FormsModule, MatSortModule, FooterComponent, RouterOutlet]
})
export class TicketsComponent {
  values4: string[] = ['Vaughan Lewis'];
}
