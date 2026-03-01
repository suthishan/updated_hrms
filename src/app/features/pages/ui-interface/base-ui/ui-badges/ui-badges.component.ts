import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-badges',
    templateUrl: './ui-badges.component.html',
    styleUrl: './ui-badges.component.scss',
    imports: []
})
export class UiBadgesComponent {
  public routes = routes;
}
