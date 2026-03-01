import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../layouts/footer/footer.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [RouterModule,MatSelectModule,FooterComponent]
})
export class DashboardComponent {

}
