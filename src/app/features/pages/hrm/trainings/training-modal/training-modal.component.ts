import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-training-modal',
    templateUrl: './training-modal.component.html',
    styleUrl: './training-modal.component.scss',
    imports: [MatSelectModule, BsDatepickerModule]
})
export class TrainingModalComponent {

}
