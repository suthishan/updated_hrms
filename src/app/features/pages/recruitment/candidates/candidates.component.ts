import { Component } from '@angular/core';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-candidates',
    templateUrl: './candidates.component.html',
    styleUrl: './candidates.component.scss',
    imports : [RouterOutlet,FooterComponent]
})
export class CandidatesComponent {

}
