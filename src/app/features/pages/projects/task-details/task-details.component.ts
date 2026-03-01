import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-task-details',
    templateUrl: './task-details.component.html',
    styleUrl: './task-details.component.scss',
    imports: [RouterLink]
})
export class TaskDetailsComponent {
  public routes = routes


}
