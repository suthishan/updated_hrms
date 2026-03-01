import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';


@Component({
    selector: 'app-ui-progress',
    templateUrl: './ui-progress.component.html',
    styleUrl: './ui-progress.component.scss',
    imports: []
})
export class UiProgressComponent {
  public routes = routes;
}
