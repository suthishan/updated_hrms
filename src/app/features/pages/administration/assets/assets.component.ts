import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { AssetModalComponent } from './asset-modal/asset-modal.component';

@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html',
    styleUrl: './assets.component.scss',
    imports: [RouterOutlet, FooterComponent, AssetModalComponent]
})
export class AssetsComponent {

}
