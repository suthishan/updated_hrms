import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-alerts',
    templateUrl: './ui-alerts.component.html',
    styleUrl: './ui-alerts.component.scss',
    imports: []
})
export class UiAlertsComponent {
  public routes = routes;
}
