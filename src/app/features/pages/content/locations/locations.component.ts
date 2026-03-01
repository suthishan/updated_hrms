import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { LocationModalComponent } from './location-modal/location-modal.component';

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',
    styleUrl: './locations.component.scss',
    imports: [RouterModule,FooterComponent,LocationModalComponent]
})
export class LocationsComponent {

}
