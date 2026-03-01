import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@Component({
    selector: 'app-jobs',
    templateUrl: './jobs.component.html',
    styleUrl: './jobs.component.scss',
    imports: [RouterOutlet, FooterComponent, MatSelectModule, BsDatepickerModule, RouterLink]
})
export class JobsComponent {
public routes=routes
}
