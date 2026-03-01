import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-language-web',
    templateUrl: './language-web.component.html',
    styleUrl: './language-web.component.scss',
    imports: [RouterLink]
})
export class LanguageWebComponent {
public routes=routes;
}
