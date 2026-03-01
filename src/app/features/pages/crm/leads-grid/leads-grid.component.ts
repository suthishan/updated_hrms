import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { breadCrumbItems } from '../../../../core/models/models';
import { routes } from '../../../../core/routes/routes';

import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { MatSelectModule } from '@angular/material/select';
import { LeadsModalComponent } from '../leads-modal/leads-modal.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-leads-grid',
    templateUrl: './leads-grid.component.html',
    styleUrl: './leads-grid.component.scss',
    imports: [RouterLink, CollapseHeaderComponent, BreadcrumbsComponent, MatSelectModule, LeadsModalComponent, FormsModule, DragDropModule]
})
export class LeadsGridComponent implements OnInit {
  routes = routes
  public lstOne: CompanyCard[] = [];
  public lstTwo: CompanyCard[] = [];
  public lstThree: CompanyCard[] = [];
  public lstFour: CompanyCard[] = [];

  // public droppedItems: lstProgress[] = [];
  public url = 'taskboard';
  breadCrumbItems: breadCrumbItems[] =[];
  constructor() {
    this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Leal Grid', active: true }
  ];
}
  ngOnInit(): void {
    this.lstOne = [
      {
        id:1,
        initials: "SM",
        CardClass: "border-warning  border border-2 mb-3",
        name: "Schumm",
        revenue: "$03,50,000",
        email: "darleeo@example.com",
        phone: "+1 12445-47878",
        location: "Newyork, United States",
        companyLogo: "company-01.svg",
      },
      {
        id:2,
        initials: "CS",
        CardClass: "border-success border border-2 mb-3",
        name: "Collins",
        revenue: "$02,10,000",
        email: "robertson@example.com",
        phone: "+1 13987-90231",
        location: "Austin, United States",
        companyLogo: "company-02.svg",
      },
      {
        id:3,
        initials: "KI",
        CardClass: "border-danger border border-2 mb-3",
        name: "Konopelski",
        revenue: "$02,18,000",
        email: "sharon@example.com",
        phone: "+1 17932-04278",
        location: "Atlanta, United States",
        companyLogo: "company-03.svg",
      },
    ];
    this.lstTwo = [
      {
        id:1,
        initials: "AS",
        CardClass: "border-purple border border-2 mb-3",
        name: "Adams",
        revenue: "$02,45,000",
        email: "vaughan12@example.com",
        phone: "+1 17392-27846",
        location: "London, United Kingdom",
        companyLogo: "company-04.svg",
      },
      {
        id:2,
        initials: "WK",
        CardClass: "border-success border border-2 mb-3",
        name: "Wizosk",
        revenue: "$01,17,000",
        email: "caroltho3@example.com",
        phone: "+1 78982-09163",
        location: "Bristol, United Kingdom",
        companyLogo: "company-05.svg",
      },
      {
        id:3,
        initials: "HR",
        CardClass: "border-danger border border-2 mb-3",
        name: "Heller",
        revenue: "$02,12,000",
        email: "dawnmercha@example.com",
        phone: "+1 27691-89246",
        location: "San Francisco, United States",
        companyLogo: "company-06.svg",
      },
    ];
    this.lstThree = [
      {
        id:1,
        initials: "GI",
        CardClass: "border-success border border-2 mb-3",
        name: "Gutkowsi",
        revenue: "$01,84,043",
        email: "rachel@example.com",
        phone: "+1 17839-93617",
        location: "Dallas, United States",
        companyLogo: "company-07.svg",
      },
      {
        id:2,
        initials: "WR",
        CardClass: "border-purple border border-2 mb-3",
        name: "Walter",
        revenue: "$09,35,189",
        email: "jonelle@example.com",
        phone: "+1 16739-47193",
        location: "Leicester, United Kingdom",
        companyLogo: "company-08.svg",
      },
      {
        id:3,
        initials: "HN",
        CardClass: "border-warning border border-2 mb-3",
        name: "Hansen",
        revenue: "$04,27,940",
        email: "jonathan@example.com",
        phone: "+1 18390-37153",
        location: "Norwich, United Kingdom",
        companyLogo: "company-09.svg",
      },
    ];
    this.lstFour = [
      {
        id:1,
        initials: "SE",
        CardClass: "border-danger border border-2 mb-3",
        name: "Steve",
        revenue: "$04,17,593",
        email: "sidney@example.com",
        phone: "+1 11739-38135",
        location: "Manchester, United Kingdom",
        companyLogo: "company-01.svg",
      },
      {
        id:2,
        initials: "LE",
        CardClass: "border-danger border border-2 mb-3",
        name: "Leuschke",
        revenue: "$08,81,389",
        email: "brook@example.com",
        phone: "+1 19302-91043",
        location: "Chicago, United States",
        companyLogo: "company-02.svg",
      },
      {
        id:3,
        initials: "AY",
        CardClass: "border-danger border border-2 mb-3",
        name: "Anthony",
        revenue: "$09,27,193",
        email: "mickey@example.com",
        phone: "+1 17280-92016",
        location: "Derby, United Kingdom",
        companyLogo: "company-03.svg",
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
  id:number;
  initials: string;
  CardClass: string,
  name: string;
  revenue: string;
  email: string;
  phone: string;
  location: string;
  companyLogo: string;
}
