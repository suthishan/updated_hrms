import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { TrainingModalComponent } from './training-modal/training-modal.component';

@Component({
    selector: 'app-trainings',
    templateUrl: './trainings.component.html',
    styleUrl: './trainings.component.scss',
    imports: [RouterModule, FooterComponent, TrainingModalComponent]
})
export class TrainingsComponent {

}
