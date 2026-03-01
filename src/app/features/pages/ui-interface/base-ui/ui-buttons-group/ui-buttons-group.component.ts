import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';


@Component({
    selector: 'app-ui-buttons-group',
    templateUrl: './ui-buttons-group.component.html',
    styleUrl: './ui-buttons-group.component.scss',
    imports: []
})
export class UiButtonsGroupComponent {
  public routes = routes;
}
