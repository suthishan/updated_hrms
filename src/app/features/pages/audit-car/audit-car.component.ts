import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../../layouts/footer/footer.component';

@Component({
  selector: 'app-audit-car',
  standalone: true,
  imports: [RouterModule, FooterComponent],
  template: `<router-outlet></router-outlet><app-footer></app-footer>`,
})
export class AuditCarComponent {}
