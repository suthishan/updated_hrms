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
import { MatFormFieldModule } from '@angular/material/form-field';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-deals-grid',
    templateUrl: './deals-grid.component.html',
    styleUrl: './deals-grid.component.scss',
    imports: [RouterLink, CollapseHeaderComponent, BreadcrumbsComponent, MatSelectModule, MatFormFieldModule, BsDatepickerModule, FormsModule, DragDropModule]
})
export class DealsGridComponent implements OnInit {
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
      { label: 'Deal Grid', active: true }
  ];
}
  ngOnInit(): void {
    this.lstOne = [
      {
        id:1,
        CardClass: "border-purple border border-2 mb-3",
        Logo: "HT",
        CompanyName: "Howell, Tremblay",
        CompanyNameOne: "and Rath",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-12.jpg",
        Name: "Sharon Roy",
        Percentage: "85%",
        Date: "10 Jan 2024",
      },
      {
        id:2,
        CardClass: "border-warning border border-2 mb-3",
        Logo: "RJ",
        CompanyName: "Robert, John",
        CompanyNameOne: "and Carlos",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-20.jpg",
        Name: "Darlee Robertson",
        Percentage: "15%",
        Date: "12 Jan 2024",
      },
      {
        id:3,
        CardClass: "border-success border border-2 mb-3",
        Logo: "WS",
        CompanyName: "Wendy, Star",
        CompanyNameOne: "and David",
        Amount: "$4,22,000",
        Email: "vaughan@example.com",
        MobileNo: "(135) 3489 516",
        Location: "Phoenix, United States",
        Image: "avatar-21.jpg",
        Name: "Vaughan Lewis",
        Percentage: "95%",
        Date: "10 Jan 2024",
      },
    ];
    this.lstTwo = [
      {
        id:1,
        CardClass: "border-purple border border-2 mb-3",
        Logo: "HT",
        CompanyName: "Howell, Tremblay",
        CompanyNameOne: "and Rath",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-12.jpg",
        Name: "Sharon Roy",
        Percentage: "85%",
        Date: "10 Jan 2024",
      },
      {
        id:2,
        CardClass: "border-warning border border-2 mb-3",
        Logo: "RJ",
        CompanyName: "Robert, John",
        CompanyNameOne: "and Carlos",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-20.jpg",
        Name: "Darlee Robertson",
        Percentage: "15%",
        Date: "12 Jan 2024",
      },
      {
        id:3,
        CardClass: "border-success border border-2 mb-3",
        Logo: "WS",
        CompanyName: "Wendy, Star",
        CompanyNameOne: "and David",
        Amount: "$4,22,000",
        Email: "vaughan@example.com",
        MobileNo: "(135) 3489 516",
        Location: "Phoenix, United States",
        Image: "avatar-21.jpg",
        Name: "Vaughan Lewis",
        Percentage: "95%",
        Date: "10 Jan 2024",
      },
    ];
    this.lstThree = [
      {
        id:1,
        CardClass: "border-purple border border-2 mb-3",
        Logo: "HT",
        CompanyName: "Howell, Tremblay",
        CompanyNameOne: "and Rath",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-12.jpg",
        Name: "Sharon Roy",
        Percentage: "85%",
        Date: "10 Jan 2024",
      },
      {
        id:2,
        CardClass: "border-warning border border-2 mb-3",
        Logo: "RJ",
        CompanyName: "Robert, John",
        CompanyNameOne: "and Carlos",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-20.jpg",
        Name: "Darlee Robertson",
        Percentage: "15%",
        Date: "12 Jan 2024",
      },
      {
        id:3,
        CardClass: "border-success border border-2 mb-3",
        Logo: "WS",
        CompanyName: "Wendy, Star",
        CompanyNameOne: "and David",
        Amount: "$4,22,000",
        Email: "vaughan@example.com",
        MobileNo: "(135) 3489 516",
        Location: "Phoenix, United States",
        Image: "avatar-21.jpg",
        Name: "Vaughan Lewis",
        Percentage: "95%",
        Date: "10 Jan 2024",
      },
    ];
    this.lstFour = [
      {
        id:1,
        CardClass: "border-purple border border-2 mb-3",
        Logo: "HT",
        CompanyName: "Howell, Tremblay",
        CompanyNameOne: "and Rath",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-12.jpg",
        Name: "Sharon Roy",
        Percentage: "85%",
        Date: "10 Jan 2024",
      },
      {
        id:2,
        CardClass: "border-warning border border-2 mb-3",
        Logo: "RJ",
        CompanyName: "Robert, John",
        CompanyNameOne: "and Carlos",
        Amount: "$2,10,000",
        Email: "sheron@example.com",
        MobileNo: "(146) 1249 296",
        Location: "Exeter, United States",
        Image: "avatar-20.jpg",
        Name: "Darlee Robertson",
        Percentage: "15%",
        Date: "12 Jan 2024",
      },
      {
        id:3,
        CardClass: "border-success border border-2 mb-3",
        Logo: "WS",
        CompanyName: "Wendy, Star",
        CompanyNameOne: "and David",
        Amount: "$4,22,000",
        Email: "vaughan@example.com",
        MobileNo: "(135) 3489 516",
        Location: "Phoenix, United States",
        Image: "avatar-21.jpg",
        Name: "Vaughan Lewis",
        Percentage: "95%",
        Date: "10 Jan 2024",
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
  CardClass: string;
  Logo: string;
  CompanyName: string;
  CompanyNameOne: string;
  Amount: string;
  Email: string;
  MobileNo: string;
  Location: string;
  Image: string;
  Name: string;
  Percentage: string;
  Date: string;
}
