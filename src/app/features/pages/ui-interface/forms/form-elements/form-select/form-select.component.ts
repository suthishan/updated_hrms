import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';



@Component({
    selector: 'app-form-select',
    templateUrl: './form-select.component.html',
    styleUrl: './form-select.component.scss',
    imports: []
})
export class FormSelectComponent {
  public routes = routes;
}
