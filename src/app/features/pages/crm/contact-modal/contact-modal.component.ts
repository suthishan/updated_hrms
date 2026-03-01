import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-contact-modal',
    templateUrl: './contact-modal.component.html',
    styleUrl: './contact-modal.component.scss',
    imports: [MatSelectModule, RouterLink, BsDatepickerModule, FormsModule, TagInputModule]
})
export class ContactModalComponent {
  public routes = routes;
  values: string[] = ['Collab', 'Promotion', 'Rated', 'Davis'];
  values1:string[]=['Vaughan Lewis'];
}
