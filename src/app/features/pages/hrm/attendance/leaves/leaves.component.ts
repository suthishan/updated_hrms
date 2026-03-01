import { Component } from '@angular/core';

import { RouterModule, RouterOutlet } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LeaveModalComponent } from './leave-modal/leave-modal.component';

@Component({
    selector: 'app-leaves',
    templateUrl: './leaves.component.html',
    styleUrl: './leaves.component.scss',
    imports: [RouterModule, RouterOutlet, BsDatepickerModule, LeaveModalComponent]
})
export class LeavesComponent {

}
