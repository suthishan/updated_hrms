import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';



@Component({
    selector: 'app-form-input-groups',
    templateUrl: './form-input-groups.component.html',
    styleUrls: ['./form-input-groups.component.scss'],
    imports: []
})
export class FormInputGroupsComponent {
  public routes = routes;
}
