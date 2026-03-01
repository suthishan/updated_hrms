import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { AccountingModalComponent } from './accounting-modal/accounting-modal.component';

@Component({
    selector: 'app-accounting',
    templateUrl: './accounting.component.html',
    styleUrl: './accounting.component.scss',
    imports: [RouterOutlet,FooterComponent,AccountingModalComponent]
})
export class AccountingComponent {

}
