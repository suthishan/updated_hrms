
import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../core/routes/routes';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
Chart.register(...registerables);
@Component({
  selector: 'app-recruitment-dashboard',
  imports: [
    BsDatepickerModule,
    FormsModule,
    CollapseHeaderComponent,
    RouterLink,
    BreadcrumbsComponent
  ],
  templateUrl: './recruitment-dashboard.component.html',
  styleUrl: './recruitment-dashboard.component.scss',
})
export class RecruitmentDashboardComponent {
  routes = routes;
  chartRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  bsConfig: Partial<BsDatepickerConfig>;
  selectedYear: Date | undefined;
  selectedTime: Date = new Date(); // Default time
  breadCrumbItems =[{}];

  constructor() {
    this.selectedYear = new Date(); // or default like new Date(2025, 0, 1)
    this.bsConfig = {
      minMode: 'month', // 👈 switch from 'year' to 'month'
      dateInputFormat: 'MMM YYYY', // 👈 Jan 2025 format
    };
  }
  @ViewChild('recruitmentCanvas', { static: true })
  recruitmentCanvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('avgHireTimeCanvas', { static: true })
  avgHireTimeCanvasRef!: ElementRef<HTMLCanvasElement>;
  ngAfterViewInit(): void {
    this.createChart();

    this.createChart2();
  }

  createChart() {
    const totalSegments = 15;
    const filledSegments = 7;

    const data = Array(totalSegments).fill(1);
    const colors = data.map((_, i) =>
      i < filledSegments ? '#FF7028' : '#F3F4F6',
    );

    const ctx = this.recruitmentCanvasRef.nativeElement.getContext('2d')!;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 0,
            borderRadius: 12,
            spacing: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -110,
        circumference: 220,
        cutout: '60%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });
  }
  createChart2() {
    const ctx = this.avgHireTimeCanvasRef.nativeElement.getContext('2d')!;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Applied to Shortlisted',
            data: [2, 4, 3],
            backgroundColor: '#0b4c5f',
            borderColor: '#ffffff',
            borderWidth: 3,
            // borderDash: [4, 4],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 70,
            stack: 'stack1',
          },
          {
            label: 'Shortlisted',
            data: [1.7, 1.7, 1.7],
            backgroundColor: '#3e6f7c',
            borderColor: '#ffffff',
            borderWidth: 3,
            // borderDash: [4, 4],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 70,
            stack: 'stack1',
          },
          {
            label: 'Interview to Offer',
            data: [4, 2, 2],
            backgroundColor: '#9fb8bf',
            borderColor: '#ffffff',
            borderWidth: 3,
            // borderDash: [4, 4],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 70,
            stack: 'stack1',
          },
          {
            label: 'Acceptance',
            data: [3, 7, 5],
            backgroundColor: '#c9d8dc',
            borderColor: '#ffffff',
            borderWidth: 3,
            // borderDash: [4, 4],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 70,
            stack: 'stack1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
              // padding: {
              //   left: -10,
              // },
            },
            ticks: {
              font: { size: 11 },
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              // borderDash: [4, 4],
              color: '#e5e7eb',
            },
            ticks: {
              stepSize: 5,
              font: { size: 11 },
            },
          },
        },
      },
    });
  }
    ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Recruitment Dashboard', active: true },
    ];
  }
}
