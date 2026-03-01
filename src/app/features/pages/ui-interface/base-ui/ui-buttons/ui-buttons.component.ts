import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-buttons',
    templateUrl: './ui-buttons.component.html',
    styleUrl: './ui-buttons.component.scss',
    imports: []
})
export class UiButtonsComponent {
  public routes = routes;
}
