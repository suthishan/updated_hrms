import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@Component({
    selector: 'app-company-modal',
    templateUrl: './company-modal.component.html',
    styleUrl: './company-modal.component.scss',
    imports: [MatSelectModule, RouterLink, MatInputModule, MatIconModule, MatChipSet, MatChip, FormsModule, TagInputModule]
})
export class CompanyModalComponent {
  public routes=routes;
  values1: string[] = ['Collab','Promotion','Rated'];
  selectedOption2: any;
  option2 = [
    {
      id: 1,
      name: 'Darlee Robertson',
    },
    { id: 2, name: 'Sharon Roy' },
    { id: 3, name: 'Vaughan' },
    { id: 4, name: 'Jessica' },
    { id: 5, name: 'Carol Thomas' },
  ];
  removeOption2(user: any) {
    const index = this.selectedOption2.indexOf(user);
    if (index !== -1) {
      this.selectedOption2.splice(index, 1);
    }
  }
}
