import { Component } from '@angular/core';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
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
  selector: 'app-it-admin-dashboard',
  imports: [CollapseHeaderComponent,NgApexchartsModule,BreadcrumbsComponent],
  templateUrl: './it-admin-dashboard.component.html',
  styleUrl: './it-admin-dashboard.component.scss',
})
export class ItAdminDashboardComponent {
  routes = routes;
 public uptime_chart: Partial<ChartOptions> | any;
 public api_chart: Partial<ChartOptions> | any;
 public ticket_chart: Partial<ChartOptions> | any;
 public jobs_chart: Partial<ChartOptions> | any;
 public storage_chart: Partial<ChartOptions> | any;
 public mfa_chart: Partial<ChartOptions> | any;
 public logactivity_chart: Partial<ChartOptions> | any;
 public usage_chart: Partial<ChartOptions> | any;
 public line_chart: Partial<ChartOptions> | any;
 public line_chart2: Partial<ChartOptions> | any;
 public line_chart3: Partial<ChartOptions> | any;
 public error_chart: Partial<ChartOptions> | any;
 breadCrumbItems =[{}];
 constructor(){
  this.uptime_chart={
    series: [{
      name: "performance",
      // Data updated to follow a "Bell Curve" (low-high-low) for the mountain look
      data: [6, 20, 75, 40, 100, 92, 43, 76, 5]
    }],
    chart: {
      height: 50,
      width: 80,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true } // Set to true to hide axes for a cleaner "shape" look
    },
    // Using an orange gradient to match your uploaded image
    colors: ['#FF8C42'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      curve: 'smooth', // Crucial for the rounded mountain top
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      show: false
    },
    grid: {
      show: false // Removes lines to focus on the mountain shape
    },
    tooltip: {
      enabled: false
    }
  };
  this.api_chart = {
    chart: {
      width: 80,
      height: 60,
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
          backgroundBarColors: ['#F8F9FA', '#F8F9FA', '#F8F9FA', '#F8F9FA', '#F8F9FA'],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 2,
        },
      },
    },
    series: [{
      name: 'Positive',
      data: [15, 40, 30, 35, 40, 35, 32]
    }, {
      name: 'Negative',
      data: [-15, -40, -30, -35, -40, -35, -32]
    }],
    colors: ['#F26522'], // Your orange color
    grid: { show: false },
    xaxis: { labels: { show: false } },
    yaxis: {
      min: -50,
      max: 50,
      show: false
    },
    tooltip: { enabled: true }
  };
  this.ticket_chart = {
    chart: {
      width: 80,
      height: 50,
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
          backgroundBarColors: ['#F8F9FA', '#F8F9FA', '#F8F9FA', '#F8F9FA', '#F8F9FA'],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 2,
        },
      },
    },
    series: [{
      name: 'Positive',
      data: [60, 0, 60, 0, 60, 0, 60]
    }, {
      name: 'Negative',
      data: [-60, -0, -60, -0, -60, -0, -60]
    }],
    colors: ['#F26522'], // Your orange color
    grid: { show: false },
    xaxis: { labels: { show: false } },
    yaxis: {
      min: -50,
      max: 50,
      show: false
    },
    tooltip: { enabled: true }
  };
  this.jobs_chart ={
    chart: {
      width: 80, // Increased width to fit all bars from screenshot
      height: 50,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 2,
        // distributed: true allows each bar to have its own color
        distributed: true,
      },
    },
    // Your data values based on the screenshot heights
    series: [{
      name: 'Jobs',
      data: [45, 30, 70, 15, 45, 100, 45, 35, 25, 15, 25]
    }],
    // The first color is 'inactive', the 6th color (index 5) is 'active'
    colors: [
      '#E9ECEF', '#E9ECEF', '#E9ECEF', '#E9ECEF', '#E9ECEF',
      '#F26522', // This is your active orange bar
      '#E9ECEF', '#E9ECEF', '#E9ECEF', '#E9ECEF', '#E9ECEF'
    ],
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true },
    legend: { show: false } // Hide legend caused by 'distributed'
  };
  this.storage_chart ={
    colors: ['#0C4B5E', '#0C4B5E', '#F26522', '#0C4B5E', '#0C4B5E', '#0C4B5E'],
    chart: {
      height: 264,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: '65%',
        borderRadius: 10,
        distributed: true,
        colors: {
          backgroundBarColors: ['#E5E7EB'],
          backgroundBarOpacity: 0.4,
          backgroundBarRadius: 10,
        },
        dataLabels: {
          position: 'bottom',
        },
      },
    },
    series: [{
      name: 'Storage',
      data: [280, 260, 140, 68, 120, 260]
    }],
    dataLabels: {
      enabled: true,
      // Positive value pushes the label down to the base of the bar
      offsetY: 10,
      style: {
        fontSize: '14px',
        colors: ['#FFFFFF'],
        fontWeight: '500'
      },
      formatter: function (val : any) {
        return val + " GB";
      },
    },
    xaxis: {
      categories: ['HR', 'Payroll', 'Attendance', 'Recruitment', 'Leaves', 'Document'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        offsetY: 5,
        style: {
          colors: '#6B7280',
          fontSize: '13px',
          fontWeight: 500,
        }
      }
    },
    yaxis: {
      min: 0, // CRITICAL: Ensures bars start from the very bottom
      max: 320,
      tickAmount: 4,
      labels: {
        offsetX: -15,
        style: {
          fontSize: '13px',
          fontWeight: 500,
          colors: '#6B7280',
        }
      }
    },
    grid: {
      show: true,
      borderColor: '#F3F4F6',
      strokeDashArray: 3,
      position: 'back',
      padding: {
        bottom: 0,
        left: -10, 
        right: -55 // Removes extra space at the bottom
      },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    tooltip: { enabled: true }
  };
   const totalBlocks = 15;
  const filledBlocks = 11;
  this.mfa_chart ={
    
    series: [{
      data: Array(totalBlocks).fill(1)
    }],

    chart: {
      type: 'bar',
      height: 16, // FIXED HEIGHT: 16px
      width: '100%',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },

    plotOptions: {
      bar: {
        distributed: true,
        // Adjusted to create a wider 12px gap between the 16px circles
        columnWidth: '85%',
        borderRadius: 8,     // 50% border-radius for perfect circles
        borderRadiusApplication: 'around',
      }
    },

    colors: [
  ({ dataPointIndex }: { dataPointIndex: number }) =>
    dataPointIndex < filledBlocks
      ? '#F26522' // Active Orange
      : '#E5E7EB' // Inactive Gray
],


    dataLabels: { enabled: false },
    grid: { show: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { show: false, max: 1 },
    tooltip: { enabled: false },

    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    }
  };
  this.logactivity_chart={
    series: [{
      name: "performance",
      // Data scaled down to fit the 0-800 range
      data: [650, 580, 700, 580, 680, 750, 620, 710, 580, 650, 750, 780, 620, 750, 650, 610, 780, 650, 750, 620, 720, 600, 780, 620, 750, 610, 710, 800, 620, 750, 610, 720, 800, 620, 710, 600, 720, 790, 620, 710, 600, 750, 620, 750, 620, 710, 800, 600, 750, 600]
    }],
    chart: {
      width: '100%',
      height: 310,
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
      zoom: { enabled: false }
    },
    colors: ['#F26522'],
    stroke: {
      show: true,
      curve: 'straight',
      width: 1.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      labels: {
        show: true,
        offsetX: 8,
        rotate: 0,
        style: {
          colors: '#6B7280',
          fontSize: '10px'
        },
        formatter: function (index:any) {
          const labels = [
            '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
            '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
          ];
          const step = Math.floor(50 / labels.length);
          return index % step === 0 ? labels[Math.floor(index / step)] : '';
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },

    // UPDATED Y-AXIS SECTION
    yaxis: {
      min: 0,
      max: 800,
      tickAmount: 4, // Intervals: 0, 200, 400, 600, 800
      labels: {
        show: true,
        align: 'left',
        minWidth: 40,
        style: {
          colors: '#6B7280',
          fontSize: '10px'
        },
        formatter: (val:any) => {
          return val; // No longer dividing by 1000
        },
        offsetX: -28
      }
    },

    grid: {
      show: false,
      padding: {
        left: 10,
        right: 2,
        bottom: 10
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      theme: 'light'
    }
  };
  this.usage_chart ={
    series: [{
      name: "performance",
      // Data points adjusted to create that rising wave effect
      data: [1200, 1200, 4800, 4800, 2000, 6000, 6000, 8000, 8000]
    }],
    chart: {
      height: 220,
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false }
    },
    // Match the dark teal/slate color from your screenshot
    colors: ['#2E5A65'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      curve: 'smooth',
      width: 3,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5, 
        opacityTo: 0.05,  
        stops: [0, 90, 95]
      }
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 0,
      xaxis: {
        lines: { show: true } 
      },
      yaxis: {
        lines: { show: false },
      },
      padding: {
        left: 0,
        right: -20
      }
    },
    xaxis: {
      categories: ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: true }
    },
    yaxis: {
      min: 0,
      max: 8000,
      tickAmount: 4,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        },
        formatter: (val:any) => {
          return val === 0 ? '0' : (val / 1000) + 'K';
        },
        offsetX: -15
      }
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      x: { show: false }
    },
    legend: {
      show: false
    }
  };
  this.line_chart = {
    series: [{
      name: "performance",
      // Peaks and valleys to create the mountain look
      data: [10, 85, 15, 45, 20, 50, 30, 15]
    }],
    chart: {
      height: 45,
      width: 100, // Fixed height at 50px
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      // sparkline: true hides all X/Y axes, labels, and grid lines automatically
      sparkline: { enabled: true }
    },
    colors: ['#E70D0D'], // Pink color from your screenshot
    stroke: {
      show: true,
      curve: 'straight', // Sharp mountain peaks
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    // Ensure all axes and grids are off for a clean look
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true }
  }
  this.line_chart2={
    series: [{
      name: "performance",
      // Peaks and valleys to create the mountain look
      data: [10, 25, 15, 45, 20, 50, 30, 15]
    }],
    chart: {
      height: 45,
      width: 100, // Fixed height at 50px
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      // sparkline: true hides all X/Y axes, labels, and grid lines automatically
      sparkline: { enabled: true }
    },
    colors: ['#0C4B5E'], // Add color from your screenshot
    stroke: {
      show: true,
      curve: 'straight', // Sharp mountain peaks
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    // Ensure all axes and grids are off for a clean look
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true }
  };
  this.line_chart3={
    series: [{
      name: "performance",
      // Peaks and valleys to create the mountain look
      data: [30, 15, 25, 35, 10, 40, 20, 45]
    }],
    chart: {
      height: 45,
      width: 100, // Fixed height at 50px
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      // sparkline: true hides all X/Y axes, labels, and grid lines automatically
      sparkline: { enabled: true }
    },
    colors: ['#FD3995'], // Add color from your screenshot
    stroke: {
      show: true,
      curve: 'straight', // Sharp mountain peaks
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    // Ensure all axes and grids are off for a clean look
    grid: { show: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false } },
    yaxis: { show: false },
    tooltip: { enabled: true }
  };
  this.error_chart={
    series: [
      { name: 'M9', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 80] },
      { name: 'M8', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 80] },
      { name: 'M7', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 80] },
      { name: 'M6', data: [0, 0, 0, 0, 0, 40, 0, 0, 0, 0, 0, 0, 40, 0, 0, 0, 80, 80] },
      { name: 'M5', data: [0, 0, 0, 40, 0, 80, 80, 0, 0, 0, 80, 80, 0, 0, 80, 0, 40, 80] },
      { name: 'M4', data: [80, 80, 0, 80, 0, 0, 80, 0, 40, 80, 0, 0, 0, 0, 0, 40, 80, 80] },
      { name: 'M3', data: [80, 80, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'M2', data: [80, 80, 80, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { name: 'M1', data: [80, 80, 80, 0, 0, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    ],
    chart: {
      height: 310,
      type: 'heatmap',
      toolbar: { show: false }
    },
    stroke: {
      width: 4,
      colors: ['#fff']
    },
    plotOptions: {
      heatmap: {
        radius: 8,
        enableShades: false,
        colorScale: {
          ranges: [
            { from: 0, to: 0, name: 'none', color: '#F1F3F4' },
            { from: 1, to: 50, name: 'low', color: '#FFB38A' },
            { from: 51, to: 100, name: 'high', color: '#F26522' }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false
    },

    // --- ADD THIS SECTION TO HIDE THE BOTTOM BOX ---
    tooltip: {
      enabled: true,
      x: {
        show: false // This hides the date/index box at the bottom
      },
      marker: {
        show: false // Keeps the tooltip clean without color dots
      }
    },
    // ----------------------------------------------
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false } // Extra backup to ensure x-axis tooltip is off
    },
    yaxis: {
      labels: { show: false }
    },
    grid: {
      padding: { right: -0 , left: -10 }
    },
    legend: {
      show: false
    }
  }
 }
   ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'IT Admin Dashboard', active: true },
    ];
  }
}
