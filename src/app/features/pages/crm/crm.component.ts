import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../layouts/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import { CompanyModalComponent } from './company-modal/company-modal.component';
import { ContactModalComponent } from './contact-modal/contact-modal.component';

@Component({
    selector: 'app-crm',
    templateUrl: './crm.component.html',
    styleUrl: './crm.component.scss',
    imports: [RouterModule,FooterComponent,MatSelectModule,CompanyModalComponent,ContactModalComponent]
})
export class CrmComponent {

}
