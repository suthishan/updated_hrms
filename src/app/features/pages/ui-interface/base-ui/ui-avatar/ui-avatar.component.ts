import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';



@Component({
    selector: 'app-ui-avatar',
    templateUrl: './ui-avatar.component.html',
    styleUrl: './ui-avatar.component.scss',
    imports: []
})
export class UiAvatarComponent {
  public routes = routes;
}
