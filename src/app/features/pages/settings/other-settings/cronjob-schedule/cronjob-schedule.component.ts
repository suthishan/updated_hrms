import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cronjob-schedule',
    templateUrl: './cronjob-schedule.component.html',
    styleUrl: './cronjob-schedule.component.scss',
    imports: [RouterLink]
})
export class CronjobScheduleComponent {
public routes=routes;
}
