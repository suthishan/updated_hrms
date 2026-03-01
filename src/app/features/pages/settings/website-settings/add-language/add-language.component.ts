import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-add-language',
    templateUrl: './add-language.component.html',
    styleUrl: './add-language.component.scss',
    imports: [RouterLink]
})
export class AddLanguageComponent {
public routes=routes;
}
