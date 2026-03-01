import { Component } from '@angular/core';

import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-asset-modal',
    templateUrl: './asset-modal.component.html',
    styleUrl: './asset-modal.component.scss',
    imports: [MatSelectModule, BsDatepickerModule]
})
export class AssetModalComponent {

}
