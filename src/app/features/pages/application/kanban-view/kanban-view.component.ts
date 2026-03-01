import { Component, OnInit } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.scss'],
  imports: [DragDropModule, FooterComponent, CollapseHeaderComponent]
})
export class KanbanViewComponent {
  routes = routes
  public lstOne: CompanyCard[] = [];
  public lstTwo: CompanyCard[] = [];
  public lstThree: CompanyCard[] = [];
  public lstFour: CompanyCard[] = [];
  public seclstOne  : CompanyCard[] = [];
  ngOnInit(): void {
    this.lstOne = [
      {
        kanbanPower: "Low",
        PowerClass:"badge bg-success badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Doccure",
      },
      {
        kanbanPower: "High",
        PowerClass:"badge bg-danger badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Tour",
      },
    ];
    this.lstTwo = [
      {
        kanbanPower: "High",
        PowerClass:"badge bg-danger badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Gigs",
      },
      {
        kanbanPower: "Medium",
        PowerClass:"badge bg-warning badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Rent",
      },
    ];
    this.lstThree = [
      {
        kanbanPower: "Low",
        PowerClass:"badge bg-success badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Sports",
      },
      {
        kanbanPower: "Low",
        PowerClass:"badge bg-success badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Estate",
      },
    ];
    this.lstFour = [
      {
        kanbanPower: "Medium",
        PowerClass:"badge bg-warning badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Estate",
      },
    ];
    this.seclstOne = [
      {
        kanbanPower: "Low",
        PowerClass:"badge bg-success badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Doccure",
      },
      {
        kanbanPower: "High",
        PowerClass:"badge bg-danger badge-xs border-info d-flex align-items-center justify-content-center",
        Name: "Dreams Tour",
      },
    ];

  }
  //  drap and drop
  onDrop(event: CdkDragDrop<CompanyCard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
interface CompanyCard {
  kanbanPower: string;
  PowerClass: string;
  Name: string;
}