import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-form-mask',
    templateUrl: './form-mask.component.html',
    styleUrls: ['./form-mask.component.scss'],
    imports: [NgxMaskDirective, FormsModule, ReactiveFormsModule]
})
export class FormMaskComponent{
  public routes = routes;
  
}
