import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../../core/routes/routes';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';

@Component({
  selector: 'app-sla-policies',
  imports: [MatSelectModule,RouterLink,CollapseHeaderComponent],
  templateUrl: './sla-policies.component.html',
  styleUrl: './sla-policies.component.scss',
})
export class SlaPoliciesComponent {
  routes= routes
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
