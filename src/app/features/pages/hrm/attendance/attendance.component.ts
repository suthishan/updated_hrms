import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { FooterComponent } from '../../../../layouts/footer/footer.component';

@Component({
    selector: 'app-attendance',
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss',
    imports: [RouterModule, RouterOutlet, FooterComponent]
})
export class AttendanceComponent {

}
