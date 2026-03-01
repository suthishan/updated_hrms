import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';


@Component({
    selector: 'app-icon-flag',
    templateUrl: './icon-flag.component.html',
    styleUrls: ['./icon-flag.component.scss'],
    imports: []
})
export class IconFlagComponent {
  public routes = routes;
}
