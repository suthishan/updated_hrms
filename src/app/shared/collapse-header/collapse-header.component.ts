import { Component } from '@angular/core';
import { DataService } from '../../core/services/data/data.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'app-collapse-header',
    templateUrl: './collapse-header.component.html',
    styleUrl: './collapse-header.component.scss',
     imports: [
    CommonModule,
    MatTooltipModule,
    TooltipModule
  ]
})
export class CollapseHeaderComponent {
  public isCollapsed = false;

  toggleCollapse() {
    this.data.toggleCollapse();
    this.isCollapsed = !this.isCollapsed;
  }
  constructor(private data: DataService) {}
}
