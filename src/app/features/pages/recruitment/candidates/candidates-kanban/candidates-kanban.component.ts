import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  transferArrayItem,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { breadCrumbItems } from '../../../../../core/models/models';
import { routes } from '../../../../../core/routes/routes';

import { BreadcrumbsComponent } from '../../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { RouterModule } from '@angular/router';
import { DateRangePickerComponent } from '../../../../../shared/date-range-picker/date-range-picker.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-candidates-kanban',
    templateUrl: './candidates-kanban.component.html',
    styleUrl: './candidates-kanban.component.scss',
    imports: [BreadcrumbsComponent, CollapseHeaderComponent, DateRangePickerComponent, RouterModule, CdkDropList, CdkDrag, MatSelectModule]
})
export class CandidatesKanbanComponent implements OnInit,OnDestroy {
  routes = routes
  public lstOne: CompanyCard[] = [];
  public lstTwo: CompanyCard[] = [];
  public lstThree: CompanyCard[] = [];
  public lstFour: CompanyCard[] = [];
  public lstFive: CompanyCard[] = [];
  public lstSix: CompanyCard[] = [];

  // public droppedItems: lstProgress[] = [];
  public url = 'taskboard';
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'Recruitment' },
      { label: 'Candidates Kanban', active: true }
  ];
}
isOpen = false
openSuccessModal() {
  this.isOpen = !this.isOpen;
}
ngOnDestroy(): void {
  this.isOpen = false
}
  ngOnInit(): void {
    this.lstOne = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-001",
        Image: "user-39.jpg",
        Name: "Harold Gaynor",
        Email :"harold@example.com",
        Role: "Accountant",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-002",
        Image: "user-40.jpg",
        Name: "Sandra Ornellas",
        Email :"sandra@example.com",
        Role: "Accountant",
        Date: "12/09/2024"
      },
    ];
    this.lstTwo = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-003",
        Image: "user-41.jpg",
        Name: "John Harris",
        Email :"john@example.com",
        Role: "Technician",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-004",
        Image: "user-42.jpg",
        Name: "Carole Langan",
        Email :"carole@example.com",
        Role: "Web Developer",
        Date: "12/09/2024"
      },
      {
        id:3,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-005",
        Image: "user-44.jpg",
        Name: "Charles Marks",
        Email :"charles@example.com",
        Role: "SEO",
        Date: "12/09/2024"
      },
      {
        id:4,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-006",
        Image: "user-43.jpg",
        Name: "Kerry Drake",
        Email :"kerry@example.com",
        Role: "Designer",
        Date: "12/09/2024"
      },
    ];
    this.lstThree = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-007",
        Image: "user-46.jpg",
        Name: "David Carmona",
        Email :"david@example.com",
        Role: "Manager",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-008",
        Image: "user-45.jpg",
        Name: "Margaret Soto",
        Email :"margaret@example.com",
        Role: "SEO Analyst",
        Date: "12/09/2024"
      },
      {
        id:3,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-009",
        Image: "user-48.jpg",
        Name: "Jeffrey Thaler",
        Email :"jeffrey@example.com",
        Role: "Admin",
        Date: "12/09/2024"
      },
    ];
    this.lstFour = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-010",
        Image: "user-47.jpg",
        Name: "Joyce Golston",
        Email :"joyce@example.com",
        Role: "Business",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-011",
        Image: "user-49.jpg",
        Name: "Cedric Rosalez",
        Email :"cedric@example.com",
        Role: "Financial",
        Date: "12/09/2024"
      },
    ];
    this.lstFive = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-012",
        Image: "user-50.jpg",
        Name: "Lillie Diaz",
        Email :"lillie@example.com",
        Role: "Receptionist",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-013",
        Image: "user-51.jpg",
        Name: "Thomas Bordelon",
        Email :"thomas@example.com",
        Role: "Director",
        Date: "12/09/2024"
      },
    ];
    this.lstSix = [
      {
        id:1,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-014",
        Image: "user-53.jpg",
        Name: "Bruce Wright",
        Email :"bruce@example.com",
        Role: "CEO",
        Date: "12/09/2024"
      },
      {
        id:2,
        BadgeClass: "badge bg-primary-transparent",
        BadgeNo: "Cand-015",
        Image: "user-54.jpg",
        Name: "Angela Thomas",
        Email :"Angela@example.com",
        Role: "Consultant",
        Date: "12/09/2024"
      },
    ]

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
  id:number;
  BadgeClass: string;
  BadgeNo: string;
  Image: string;
  Name: string;
  Email: string;
  Role: string;
  Date: string;
}
