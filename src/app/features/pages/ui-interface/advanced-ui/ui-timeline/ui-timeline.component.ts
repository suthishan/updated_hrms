import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-timeline',
    templateUrl: './ui-timeline.component.html',
    styleUrl: './ui-timeline.component.scss',
    imports: []
})
export class UiTimelineComponent {
  public routes = routes;
}
