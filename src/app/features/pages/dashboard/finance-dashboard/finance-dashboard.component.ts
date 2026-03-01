import { Component, ElementRef, ViewChild } from '@angular/core';
import { DateRangePickerComponent } from '../../../../shared/date-range-picker/date-range-picker.component';
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
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);
import { routes } from '../../../../core/routes/routes';
import { RouterLink } from '@angular/router';
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
  selector: 'app-finance-dashboard',
  imports: [DateRangePickerComponent,
    CollapseHeaderComponent,
    NgApexchartsModule,
    RouterLink,
    RouterLink,
    BreadcrumbsComponent
  ],
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.scss',
})
export class FinanceDashboardComponent {
  routes = routes
  public payroll_chart: Partial<ChartOptions> | any;
  public reimbrusement_chart: Partial<ChartOptions> | any;
  public headcount_chart: Partial<ChartOptions> | any;
  public budget_chart: Partial<ChartOptions> | any;
  public finance_chart: Partial<ChartOptions> | any;
  breadCrumbItems =[{}];
    @ViewChild('costCanvas', { static: true })
  costChartRef!: ElementRef<HTMLCanvasElement>;
constructor(){
  this.payroll_chart ={
    // Data values are now populated to avoid Syntax Errors
    series: [
      { name: 'Payroll', data: [600] },
      { name: 'Remaining', data: [1000] },
    ],
    chart: {
      type: 'bar',
      height: 45,
      stacked: true,
      stackType: '100%',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '100%',
      }
    },
    colors: ['#54C564', '#E5E7EB'],
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        style: 'verticalLines',
        width: 6,
        strokeWidth: 4
      }
    },
    tooltip: { enabled: true },
    xaxis: { categories: ['Total'] }
  };
  this.reimbrusement_chart ={
    // Data values are now populated to avoid Syntax Errors
    series: [
      { name: 'Reimbrusement', data: [1000] },
      { name: 'Remaining', data: [600] },
    ],
    chart: {
      type: 'bar',
      height: 45,
      stacked: true,
      stackType: '100%',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '100%',
      }
    },
    colors: ['#7298A4', '#E5E7EB'],
    fill: {
      type: 'pattern',
      opacity: 1,
      pattern: {
        style: 'verticalLines',
        width: 6,
        strokeWidth: 4
      }
    },
    tooltip: { enabled: true },
    xaxis: { categories: ['Total'] }
  };
  this.headcount_chart ={
    series: [{
      name: 'Revenue',
      data: [20, 28, 29, 20, 15, 30, 25, 20, 20, 12, 20, 20, 30, 15, 20, 25],
    }, {
      name: 'Expenses',
      data: [-20, -30, -20, -20, -25, -25, -20, -30, -20, -25, -30, -20, -30, -20, -10, -28]
    }],
    grid: {
      padding: {
        top: 5, // Adds space on the left
        right: 0, // Adds space on the right
      },
    },
    colors: ['#F26522', '#E5E7EB'],
    chart: {
      type: 'bar',
      height: 240,
      stacked: true,
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 280,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        borderRadiusApplication: "around", // "around" / "end" 
        borderRadiusWhenStacked: "all", // "all"/"last"
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      opposite: true,
      labels: {
        offsetX: -5,
        formatter: (val:any) => {
          return val / 1 + 'K'
        },
      },
      min: -30,
      max: 30,
      tickAmount: 6,
    },
    xaxis: {
      categories: ['', '', 'Jan', '', '', '', 'Feb', '', '', '', 'Mar', '', '', '', 'Apr', ''],
    },
    legend: { show: false },
    fill: {
      opacity: 1
    }
  }
  this.budget_chart = {
    chart: {
      height: 280,
      type: 'area',
      toolbar: {
        show: false,
      }
    },
    colors: ['#F26522', '#0C4B5E'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 1,
    },
    // Added the fill style from the first chart
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    series: [{
      name: 'Budget',
      data: [5, 10, 8, 6, 5, 10, 8, 10]
    }, {
      name: 'Spent',
      data: [15, 20, 16, 15, 15, 20, 18, 20]
    }],

    xaxis: {
      categories: ["Engineering", "Sales", "Marketing", "Operations", "Support", "Admin", "UI/UX", "Devops"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 40,
      labels: {
        offsetX: -15,
        formatter: function (value:any) {
          return value + "k"; // Label remains exactly as you had it
        }
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: -15,
        top: 0,
      },
    },
  };
  this.finance_chart ={
    colors: ['#FF7129'],
    chart: {
      height: 140,
      type: 'bar',
      toolbar: {
        show: false,
      },
      sparkline: { enabled: true },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical', // Top to bottom (180deg)
        shadeIntensity: 0.5,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: '#9CB9C2', // Top color
            opacity: 0.5
          },
          {
            offset: 100,
            color: '#F8F9FA', // Bottom color
            opacity: 0.5
          }
        ]
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 10
        }
      }
    }],
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 12,
        horizontal: false,
        endingShape: 'rounded', dataLabels: {
          position: 'bottom', // Anchors the label to the base of the bar
        },
        colors: {
          backgroundBarColors: ['#F8F9FA'], // Background color for bars
          backgroundBarOpacity: 0.5,
          hover: {
            enabled: true,
            borderColor: '#F26522', // Color when hovering over the bar
          }
        }
      },
    },
    series: [{
      name: 'Amount',
      data: [30, 60, 30, 40, 100, 80, 90, 50, 60, 40, 30, 60]
    }],
    dataLabels: {
      enabled: false, // Must be true
      formatter: function (val:any) {
        return "$" + val; // Display the raw value
      },
      offsetY: 10, // Adjust this value to nudge the text up or down from the bottom
      style: {
        fontSize: '12px',
        colors: ['#F26522'], // Gray color to match your design
        fontWeight: 'bold'
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#111827',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        show: false
      }
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      padding: {
        left: 0,
        right: 0,
        top: 0,
      },
    },
    legend: {
      show: false
    },
  }
}
  ngAfterViewInit(): void {
    this.initCostChart()
  }
  private initCostChart(): void {

    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const value = '$2,458,900';

        ctx.save();
        ctx.font = '600 12px Arial';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const x = (chartArea.left + chartArea.right) / 2;
        const y = chartArea.bottom - 50;

        ctx.fillText(value, x, y);
        ctx.restore();
      }
    };

    const ctx = this.costChartRef.nativeElement.getContext('2d')!;
    
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Salaries', 'Benefits', 'Bonuses', 'Overtime', 'Training', 'Incentives'],
        datasets: [
          {
            label: 'Semi Donut',
            data: [40, 10, 10, 20, 10, 10],
            backgroundColor: [
              '#0C4B5E',
              '#618B98',
              '#7298A4',
              '#84A5AF',
              '#95B2BB',
              '#A7BFC6'
            ],
            borderWidth: 5,
            borderRadius: 10,
            borderColor: '#fff',
            hoverBorderWidth: 0,
            
          }
        ]
      },
      options: {
        rotation: -90,
        circumference: 180,
        cutout: '80%',
        layout: {
          padding: {
            top: -20,
            bottom: -20
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      },
      plugins: [centerTextPlugin]
    };

    new Chart(ctx, config);
  }
    ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Finance Dashboard', active: true },
    ];
  }
}
