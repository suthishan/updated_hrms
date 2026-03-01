import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePickerModule } from 'primeng/datepicker';
import {
  CalendarOptions,
  EventApi,
  DateSelectArg,
  EventClickArg,
  Calendar,
} from '@fullcalendar/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import { routes } from '../../../../../core/routes/routes';
declare const bootstrap: any;


@Component({
  selector: 'app-holiday-calendar',
  imports: [ BsDatepickerModule,MatSelectModule,RouterLink,FullCalendarModule,CommonModule,FormsModule],
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss',
})
export class HolidayCalendarComponent {
  routes = routes
@ViewChild('eventModal') eventModal!: ElementRef;

showEventDetailsModal = false;
// modalInstance!: Modal;
  eventDetails:any=null;
  dates: Date[] =[];
  date: Date[] | undefined;
  dropdownOpen = false;
  selectedTime: Date = new Date();
  addtime2: Date | undefined;
  addtime: Date | undefined;
  time: Date[] | undefined; 
  time2: Date[] | undefined; 
  bsInlineValue = new Date()
constructor(private router:Router){}
  ngOnInit(): void {}
    // Open the dropdown
    openDropdown() {
      this.dropdownOpen = true;
    }

    // Close the dropdown
    closeDropdown() {
      this.dropdownOpen = false;
    }

    // Update displayed time when selection changes
    onTimeChange() {
      this.closeDropdown(); // Close dropdown after time selection
    }
  ngAfterViewInit(): void {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar2');
    const today=new Date();
    const calendar = new Calendar(calendarEl!, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      editable: true,
      droppable: true, // Enable drag and drop
      
      events: [
        {
          title: 'New Year',
          className: 'badge badge-pink-transparent',
          backgroundColor: '#ffedf6',
          textColor: '#FD3995',
         start: new Date(today.getFullYear(), today.getMonth(), 2)
  .toISOString()
  .slice(0, 10),

        },
        
      ],
      eventDrop: this.handleEventDrop.bind(this),
      // drop: this.handleExternalDrop.bind(this),

      headerToolbar: {
        start: 'today prev,next',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      eventClick: this.handleEventClick.bind(this),
      drop: (info) => {
        console.log('Event dropped:', info.draggedEl.innerText.trim());
      },
      eventReceive: (info) => {
        console.log('Event added:', info.event.title);
      },
    });

    calendar.render();
    const containerEl = document.getElementById('external-events');
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: (eventEl) => {
          const data = eventEl.getAttribute('data-event');
          const cls = eventEl.getAttribute('data-event-classname');
          return {
            ...JSON.parse(data ?? '{}'),
            className: cls ? [cls] : [],
          };
        },
      });
    }

  }
  handleEventClick(info: EventClickArg) {

    
    this.eventDetails = {
      title: info.event.title
    };
    this.showEventDetailsModal = true;
    document.body.classList.add('modal-open');
    // if (!this.modalInstance) {
      // this.modalInstance = new Modal (this.eventModal.nativeElement);
    // }
    // this.modalInstance.show();   
  }
  handleEventDetailsClose() {
    this.showEventDetailsModal = false;
    document.body.classList.remove('modal-open');
    // this.modalInstance.hide();  
  }
  
  current:number=1
  next(): void {
    if(this.current<6){
    this.current+=1;
    }
  }
  previous():void{
    if(this.current>1){
      this.current-=1
    }
  }
  handleEventDrop(info: any) {
    console.log('Event moved:', info.event.title, '→', info.event.start);
    // TODO: update backend with new date
  }

  handleExternalDrop(info: any) {
    console.log('External event dropped on:', info.dateStr);
    // TODO: save new event to backend
  }

}
