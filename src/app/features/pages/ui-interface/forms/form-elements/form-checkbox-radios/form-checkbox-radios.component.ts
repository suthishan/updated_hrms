import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';

import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-form-checkbox-radios',
    templateUrl: './form-checkbox-radios.component.html',
    styleUrl: './form-checkbox-radios.component.scss',
    imports: [FormsModule]
})
export class FormCheckboxRadiosComponent {
  public routes = routes;
}
