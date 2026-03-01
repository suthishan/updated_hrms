import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';



@Component({
    selector: 'app-form-elements',
    templateUrl: './form-elements.component.html',
    styleUrl: './form-elements.component.scss',
    imports: []
})
export class FormElementsComponent {
  public routes = routes;
}
