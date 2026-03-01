import { Component } from '@angular/core';
import { routes } from '../../../../../core/routes/routes';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
  selector: 'app-ticket-automation',
  imports: [RouterLink,MatSelectModule,CollapseHeaderComponent],
  templateUrl: './ticket-automation.component.html',
  styleUrl: './ticket-automation.component.scss',
})
export class TicketAutomationComponent {
routes = routes
allSelected = false;

toggleSelectAll(): void {
  this.allSelected = !this.allSelected;

  const elements = document.querySelectorAll(
    '.form-check.form-check-md input[type="checkbox"]'
  ) as NodeListOf<HTMLInputElement>;

  elements.forEach(item => {
    item.checked = this.allSelected;
  });
}
}
