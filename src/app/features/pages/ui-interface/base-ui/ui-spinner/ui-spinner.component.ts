import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-spinner',
    templateUrl: './ui-spinner.component.html',
    styleUrl: './ui-spinner.component.scss',
    imports: []
})
export class UiSpinnerComponent {
  public routes = routes;
}
