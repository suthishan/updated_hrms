import { Component } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-perfomance-modal',
    templateUrl: './perfomance-modal.component.html',
    styleUrl: './perfomance-modal.component.scss',
    imports: [MatSelectModule, BsDatepickerModule]
})
export class PerfomanceModalComponent {

}
