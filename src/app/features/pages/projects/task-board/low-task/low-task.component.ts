import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-low-task',
    templateUrl: './low-task.component.html',
    styleUrl: './low-task.component.scss',
    imports: [CommonModule,DragDropModule]
})
export class LowTaskComponent implements OnInit {
  public lstTodo: lstProgress[] = [];
  public lstPending: lstProgress[] = [];
  public lstCompleted: lstProgress[] = [];
  public lstInprogress: lstProgress[] = [];
  public lstHold: lstProgress[] = [];
  public lstReview: lstProgress[] = [];
  // public droppedItems: lstProgress[] = [];
  public url = 'taskboard';

  ngOnInit(): void {
    this.lstReview = [
      {
        id: 1,
        taskname: 'Patient Feedback',
        taskpriority: 'Medium',
        duedate: '16/04/2024',
        percentage: 100,
        share: [
          'avatar-30.jpg',
          'avatar-31.jpg',
          'avatar-05.jpg',
          'avatar-09.jpg',
          'avatar-11.jpg',
        ],
      },
      {
        id: 2,
        taskname: 'Appointment Scheduling',
        taskpriority: 'High',
        duedate: '24/04/2024',
        percentage: 100,
        share: [
          'avatar-20.jpg',
          'avatar-21.jpg',
          'avatar-23.jpg',
          'avatar-22.jpg',
          'avatar-05.jpg',
        ],
      },
    ];
    this.lstHold = [
      {
        id: 1,
        taskname: 'Patient Feedback',
        taskpriority: 'High',
        duedate: '22/04/2024',
        percentage: 15,
        share: [
          'avatar-30.jpg',
          'avatar-31.jpg',
          'avatar-05.jpg',
          'avatar-09.jpg',
          'avatar-11.jpg',
        ],
      },
      {
        id: 2,
        taskname: 'Telemedicine Implementation',
        taskpriority: 'Low',
        duedate: '22/04/2024',
        percentage: 40,
        share: [
          'avatar-30.jpg',
          'avatar-31.jpg',
          'avatar-21.jpg',
          'avatar-23.jpg',
          'avatar-08.jpg',
        ],
      },
    ];
    this.lstInprogress = [
      {
        id: 1,
        taskname: 'Doctor Module',
        taskpriority: 'High',
        duedate: '20/04/2024',
        percentage: 35,
        share: [
          'avatar-15.jpg',
          'avatar-16.jpg',
          'avatar-17.jpg',
          'avatar-20.jpg',
          'avatar-21.jpg',
        ],
      },
      {
        id: 2,
        taskname: 'Inventory and Supplies',
        taskpriority: 'Low',
        duedate: '21/04/2024',
        percentage: 60,
        share: [
          'avatar-20.jpg',
          'avatar-23.jpg',
          'avatar-24.jpg',
          'avatar-25.jpg',
          'avatar-05.jpg',
        ],
      },
    ];
    this.lstTodo = [
      {
        id: 1,
        taskname: 'Payment Gateway',
        taskpriority: 'High',
        duedate: '18/04/2024',
        percentage: 40,
        share: [
          'avatar-19.jpg',
          'avatar-29.jpg',
          'avatar-16.jpg',
          'avatar-01.jpg',
          'avatar-02.jpg',
        ],
      },
      {
        id: 2,
        taskname: 'Patient appointment booking',
        taskpriority: 'Medium',
        duedate: '15/04/2024',
        percentage: 20,
        share: [
          'avatar-01.jpg',
          'avatar-02.jpg',
          'avatar-03.jpg',
          'avatar-04.jpg',
          'avatar-05.jpg',
        ],
      },
    ];
    this.lstCompleted = [
      {
        id: 1,
        taskname: 'Billing and Payments',
        taskpriority: 'Medium',
        duedate: '22/04/2024',
        percentage: 100,
        share: [
          'avatar-25.jpg',
          'avatar-26.jpg',
          'avatar-30.jpg',
          'avatar-31.jpg',
          'avatar-01.jpg',
        ],
      },
    ];
    this.lstPending = [
      {
        id: 1,
        taskname: 'Patient appointment booking',
        taskpriority: 'Low',
        duedate: '15/04/2024',
        percentage: 20,
        share: [
          'avatar-01.jpg',
          'avatar-02.jpg',
          'avatar-03.jpg',
          'avatar-04.jpg',
          'avatar-05.jpg',
        ],
      },
      {
        id: 2,
        taskname: 'Payment Gateway',
        taskpriority: 'High',
        duedate: '15/04/2024',
        percentage: 40,
        share: [
          'avatar-01.jpg',
          'avatar-02.jpg',
          'avatar-03.jpg',
          'avatar-04.jpg',
          'avatar-05.jpg',
        ],
      },
    ];
  }

  //  drap and drop
  onDrop(event: CdkDragDrop<lstProgress[]>) {
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

export interface lstProgress {
  id: number;
  taskname: string;
  taskpriority: string;
  duedate: string;
  percentage: number;
  share: string[];
}

