import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';

@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.scss',
    imports: [RouterOutlet,FooterComponent]
})
export class SalesComponent {

}
