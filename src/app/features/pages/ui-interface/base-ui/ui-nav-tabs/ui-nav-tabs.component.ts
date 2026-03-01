import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-nav-tabs',
    templateUrl: './ui-nav-tabs.component.html',
    styleUrl: './ui-nav-tabs.component.scss',
    imports: []
})
export class UiNavTabsComponent {
  public routes = routes;
}
