import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';

import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-form-floating-labels',
    templateUrl: './form-floating-labels.component.html',
    styleUrl: './form-floating-labels.component.scss',
    imports: [FormsModule]
})
export class FormFloatingLabelsComponent {
  public routes = routes;
}
