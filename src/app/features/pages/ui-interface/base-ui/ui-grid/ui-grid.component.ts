import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-grid',
    templateUrl: './ui-grid.component.html',
    styleUrl: './ui-grid.component.scss',
    imports: []
})
export class UiGridComponent {
  public routes = routes;
}
