import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../layouts/footer/footer.component';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { TaskModalComponent } from './task-board/task-modal/task-modal.component';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    imports: [RouterModule,FooterComponent,ProjectModalComponent,TaskModalComponent]
})
export class ProjectsComponent {
}
