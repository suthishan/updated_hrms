import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-carousel',
    templateUrl: './ui-carousel.component.html',
    styleUrl: './ui-carousel.component.scss',
    imports: []
})
export class UiCarouselComponent {
  public routes = routes;
}
