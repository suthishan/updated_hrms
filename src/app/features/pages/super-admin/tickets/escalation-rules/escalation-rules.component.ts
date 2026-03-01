import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../../core/routes/routes';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
  selector: 'app-escalation-rules',
  imports: [MatSelectModule,RouterLink,CollapseHeaderComponent],
  templateUrl: './escalation-rules.component.html',
  styleUrl: './escalation-rules.component.scss',
})
export class EscalationRulesComponent {
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
