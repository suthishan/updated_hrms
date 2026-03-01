import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { routes } from '../../../../core/routes/routes';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}
@Component({
  selector: 'app-payroll-dashboard',
  imports: [
    BsDatepickerModule,
    FormsModule,
    CollapseHeaderComponent,
    NgApexchartsModule,
    BreadcrumbsComponent
  ],
  templateUrl: './payroll-dashboard.component.html',
  styleUrl: './payroll-dashboard.component.scss',
})
export class PayrollDashboardComponent {
  routes = routes;
  @ViewChild('chart') chart!: ChartComponent;
  public distribution_chart: Partial<ChartOptions> | any;
  public trend_chart: Partial<ChartOptions> | any;
  public line_chart: Partial<ChartOptions> | any;
  public line_chart2: Partial<ChartOptions> | any;
  public line_chart3: Partial<ChartOptions> | any;
  breadCrumbItems =[{}];
  bsConfig: Partial<BsDatepickerConfig>;
  selectedYear: Date | undefined;
  selectedTime: Date = new Date(); // Default time
  active = 'active-1';

  setActive(activate : string):void{
      this.active = activate
  }
  constructor() {
    this.selectedYear = new Date(); // or default like new Date(2025, 0, 1)
    this.bsConfig = {
      minMode: 'month', // 👈 switch from 'year' to 'month'
      dateInputFormat: 'MMM YYYY', // 👈 Jan 2025 format
    };
    this.distribution_chart = {
      chart: {
        width: '100%',
        height: 240,
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: '15px',
          borderRadius: 6,
          borderRadiusApplication: 'around',
          distributed: true,
          colors: {
            backgroundBarColors: ['#0000'],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 6,
          },
        },
      },
      colors: [
        '#E5E7EB',
        '#F26522',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
        '#E5E7EB',
      ],
      dataLabels: { enabled: false },
      series: [
        {
          name: 'Income Range',
          data: [40, 96, 50, 40, 65, 45, 75, 70, 60, 45, 80],
        },
      ],
      grid: {
        show: true,
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          left: 10,
        },
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          show: true,
          align: 'left', // This makes the text "text-align: start"
          rotate: 0,
          style: {
            colors: '#6B7280',
            fontSize: '14px',
          },
          // Use a negative offsetX to pull the left-aligned text away from the chart edge
          offsetX: 6,
          formatter: function (val: any) {
            if (val === 25) return '$30k-50k';
            if (val === 50) return '$50k-80k';
            if (val === 75) return '$80k-120k';
            if (val === 100) return '$120k-180k';
            return '';
          },
        },
        axisBorder: { show: false },
      },
      // ADD THIS SECTION TO HIDE THE 1-11 LABELS
      legend: {
        show: false,
      },
      annotations: {
        points: [
          {
            x: 2,
            y: 0,
            marker: {
              size: 5,
              fillColor: '#F26522',
              strokeColor: '#fff',
              strokeWidth: 2,
            },
          },
        ],
      },
      tooltip: { enabled: true },
    };
    this.trend_chart = {
      series: [
        {
          name: 'Line 1',
          data: [300, 300, 225, 225, 225], // 5 data points
          color: '#12434e',
        },
        {
          name: 'Line 2',
          data: [150, 150, 5, 75, 150], // 5 data points
          color: '#f46a25',
        },
      ],
      chart: {
        type: 'line',
        height: 305,
        toolbar: { show: false },
      },
      stroke: {
        curve: 'stepline',
        width: 2.5,
      },
      markers: {
        size: 5,
        strokeWidth: 0,
        hover: { sizeOffset: 2 },
      },
      xaxis: {
        // 5 categories starting from Jan
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        labels: {
          show: true, // Bottom labels remain hidden as requested
          style: {
            colors: '#6B7280',
            fontSize: '13px',
            fontweight: '500',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 350,
        tickAmount: 4,
        labels: {
          align: 'left', // Left aligned
          offsetX: -15,
          style: {
            colors: '#6B7280',
            fontSize: '13px',
            fontweight: '500',
          },
          formatter: function (val: any) {
            return '$' + val + 'k';
          },
        },
      },
      grid: {
        borderColor: '#f1f1f1',
        xaxis: {
          lines: { show: true },
        },
        yaxis: {
          lines: { show: true },
        },
        padding: {
          right: -7,
        },
      },
      title: {
        text: undefined,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    };
    this.line_chart = {
      chart: {
        width: 100,
        height: 45,
        type: 'bar',
        stacked: true, // Keep stacked for the mirrored effect
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          // Adjust this percentage until the bars look exactly 8px wide
          columnWidth: '45%',
          borderRadius: 2,
          colors: {
            // This creates the light background "track" behind the bars
            backgroundBarColors: [
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
            ],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 5,
          },
        },
      },
      series: [
        {
          name: 'Positive',
          data: [15, 40, 30, 35, 40, 35, 32],
        },
        {
          name: 'Negative',
          data: [-15, -40, -30, -35, -40, -35, -32],
        },
      ],
      colors: ['#F26522'], // Your orange color
      grid: { show: false },
      xaxis: { labels: { show: false } },
      yaxis: {
        min: -50,
        max: 50,
        show: false,
      },
      tooltip: { enabled: true },
    };
    this.line_chart2 = {
      chart: {
        width: 100,
        height: 45,
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%', // Keeps the bar width at roughly 8px
          borderRadius: 2,
          colors: {
            backgroundBarColors: [
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
            ],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 5,
          },
        },
      },
      series: [
        {
          name: 'Positive',
          data: [10, 30, 20, 25, 30, 25, 22],
        },
        {
          name: 'Negative',
          data: [-10, -30, -20, -25, -30, -25, -22],
        },
      ],
      colors: ['#0C4B5E'], // Dark Teal color from your design
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false }, // Removes the bottom/center line
        axisTicks: { show: false },
      },
      yaxis: {
        min: -50,
        max: 50,
        show: false,
        axisBorder: { show: false }, // Ensures no vertical center line remains
      },
      tooltip: { enabled: true },
    };
    this.line_chart3 = {
      chart: {
        width: 100,
        height: 45,
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%', // Keeps the bar width at roughly 8px
          borderRadius: 2,
          colors: {
            backgroundBarColors: [
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
              '#F8F9FA',
            ],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 5,
          },
        },
      },
      series: [
        {
          name: 'Positive',
          data: [20, 40, 30, 35, 40, 35, 32],
        },
        {
          name: 'Negative',
          data: [-20, -40, -30, -35, -40, -35, -32],
        },
      ],
      colors: ['#FFC107'], // Dark Teal color from your design
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false }, // Removes the bottom/center line
        axisTicks: { show: false },
      },
      yaxis: {
        min: -50,
        max: 50,
        show: false,
        axisBorder: { show: false }, // Ensures no vertical center line remains
      },
      tooltip: { enabled: true },
    };
  }
    ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Payroll Dashboard', active: true },
    ];
  }
}
