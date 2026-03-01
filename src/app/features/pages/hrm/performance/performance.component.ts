import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { PerfomanceModalComponent } from './perfomance-modal/perfomance-modal.component';

@Component({
    selector: 'app-performance',
    templateUrl: './performance.component.html',
    styleUrl: './performance.component.scss',
    imports: [RouterModule, FooterComponent, PerfomanceModalComponent]
})
export class PerformanceComponent {

}
