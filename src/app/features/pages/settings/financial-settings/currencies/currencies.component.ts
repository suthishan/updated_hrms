
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-currencies',
    templateUrl: './currencies.component.html',
    styleUrl: './currencies.component.scss',
    imports: [MatSelectModule]
})
export class CurrenciesComponent {

}
