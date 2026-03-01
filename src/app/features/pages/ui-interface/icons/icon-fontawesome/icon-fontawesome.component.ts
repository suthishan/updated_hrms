import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';


@Component({
    selector: 'app-icon-fontawesome',
    templateUrl: './icon-fontawesome.component.html',
    styleUrls: ['./icon-fontawesome.component.scss'],
    imports: []
})
export class IconFontawesomeComponent {
  public routes = routes;
}
