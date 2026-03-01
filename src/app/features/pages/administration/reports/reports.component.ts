import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss',
    imports: [RouterOutlet, FooterComponent]
})
export class ReportsComponent {

}
