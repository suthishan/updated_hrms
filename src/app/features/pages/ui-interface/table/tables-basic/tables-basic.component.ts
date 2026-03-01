import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';


@Component({
    selector: 'app-tables-basic',
    templateUrl: './tables-basic.component.html',
    styleUrl: './tables-basic.component.scss',
    imports: []
})
export class TablesBasicComponent {
 public routes=routes;
}
