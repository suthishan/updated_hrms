import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { PayrollModalComponent } from './payroll-modal/payroll-modal.component';

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrl: './payroll.component.scss',
    imports: [RouterOutlet,FooterComponent,PayrollModalComponent]
})
export class PayrollComponent {

}
