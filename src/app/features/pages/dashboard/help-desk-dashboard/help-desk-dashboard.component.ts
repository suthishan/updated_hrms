import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { routes } from '../../../../core/routes/routes';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
Chart.register(...registerables);
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
  selector: 'app-help-desk-dashboard',
  imports: [
    CollapseHeaderComponent,
    NgApexchartsModule,
    RouterLink,
    BreadcrumbsComponent
  ],
  templateUrl: './help-desk-dashboard.component.html',
  styleUrl: './help-desk-dashboard.component.scss',
})
export class HelpDeskDashboardComponent {
  routes = routes;
  public ticket_chart: Partial<ChartOptions> | any;
  public ticketStatus_chart: Partial<ChartOptions> | any;
  public sla_chart: Partial<ChartOptions> | any;
  public backlog_chart: Partial<ChartOptions> | any;
  breadCrumbItems =[{}];
  rate_chart: any = {
    chart: {},
    series: [],
    markers: {},
    xaxis: {},
    yaxis: {},
    grid: {},
    tooltip: {},
    legend: {},
  };
  @ViewChild('ticketCategoryChart', { static: true })
  ticketCategoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('agentPerf', { static: true })
  agentPerfEl!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef) {
    this.ticket_chart = {
      chart: {
        type: 'area',
        height: 241,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "'Public Sans', sans-serif", // Standard clean dashboard font
      },
      // Data points adjusted to visually match the peaks in your image
      series: [
        { name: 'Created', data: [45, 60, 95, 70, 75, 60, 75] },
        { name: 'Resolved', data: [145, 155, 185, 145, 145, 170, 170] },
      ],
      colors: ['#F26522', '#0D4C63'], // Exact colors from image
      stroke: {
        curve: 'straight', // Important: The image does not use smooth curves
        width: 1.5,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.35, // 👈 visible fill at top
          opacityTo: 0.05, // 👈 soft fade at bottom
          stops: [0, 100],
        },
      },
      markers: {
        size: 4,
        colors: ['#F26522', '#0D4C63'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 6 },
      },
      grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3, // Dashed horizontal lines
        padding: {
          right: -8,
        },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          offsetX: 2,
          style: {
            // Highlights "Thu" in orange, others in gray
            colors: [
              '#8e94a9',
              '#8e94a9',
              '#8e94a9',
              '#F26522',
              '#8e94a9',
              '#8e94a9',
              '#8e94a9',
            ],
            fontSize: '13px',
          },
        },
      },
      yaxis: {
        min: 0,
        max: 400,
        tickAmount: 4, // Forces 0, 100, 200, 300, 400
        labels: {
          offsetX: -15,
          style: {
            colors: '#8e94a9',
            fontSize: '13px',
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        custom: function ({
          series,
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          series: any;
          seriesIndex: any;
          dataPointIndex: any;
          w: any;
        }) {
          return `
                    <div class="custom-apex-tooltip shadow-sm">
                        <div class="tooltip-title">September</div>
                        <div class="tooltip-row">
                            <div class="tooltip-col">
                                <span class="label"><span class="dot orange"></span> Created</span>
                                <span class="value">${series[0][dataPointIndex]}</span>
                            </div>
                            <div class="tooltip-col">
                                <span class="label"><span class="dot blue"></span> Resolved</span>
                                <span class="value">${series[1][dataPointIndex]}</span>
                            </div>
                        </div>
                    </div>
                `;
        },
      },
      legend: {
        show: false,
        position: 'bottom',
        horizontalAlign: 'center',
        markers: { radius: 12 },
      },
      dataLabels: { enabled: false },
    };
    this.ticketStatus_chart = {
      chart: {
        height: 296,
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
      },

      series: [72, 55, 38, 22],

      plotOptions: {
        radialBar: {
          startAngle: -120,
          endAngle: 240,

          hollow: {
            size: '18%',
          },

          track: {
            background: '#f2f2f2',
            strokeWidth: '100%',
            opacity: 1,
            margin: 6,
          },

          dataLabels: {
            show: false,
          },
        },
      },

      stroke: {
        lineCap: 'round',
      },

      colors: ['#F26522', '#1B84FF', '#FFC107', '#AB47BC'],

      labels: ['Open', 'In Progres', 'On Hold', 'Closed'],
    };
    this.sla_chart = {
      series: [80.5],
      chart: {
        type: 'radialBar',
        height: 230,
        sparkline: { enabled: true },
      },

      colors: ['#F26522'],

      plotOptions: {
        radialBar: {
          startAngle: -110,
          endAngle: 250,

          hollow: {
            size: '62%',
          },

          track: {
            background: '#E5E7EB',
            strokeWidth: '100%',
          },

          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: '24px',
              fontWeight: 600,
              color: '#1F2937',
              offsetY: 0,
              offsetX: 0,
              textAnchor: 'middle',
              formatter: function (val: any) {
                return val.toFixed(1) + '%';
              },
            },
          },
        },
      },

      stroke: {
        lineCap: 'round',
      },
    };
    const maxValue = 700;
    const actual = [80, 280, 330, 410, 470, 520, 560];
    const remaining = actual.map((v) => maxValue - v);
    this.backlog_chart = {
      series: [
        {
          name: 'Growth',
          data: actual,
        },
        {
          name: 'Remaining',
          data: remaining,
        },
      ],

      chart: {
        height: 300,
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
      },

      colors: ['#0F4C5C', '#EEF2F5'],

      plotOptions: {
        bar: {
          columnWidth: '80%',
          borderRadius: 8,
          borderRadiusWhenStacked: 'last',
          endingShape: 'rounded',
        },
      },

      stroke: {
        width: [0, 1],
        colors: ['transparent', '#CBD5E1'],
        dashArray: [0, 6], // dotted tube
      },

      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          offsetX: 1,
          style: {
            colors: '#6B7280',
            fontSize: '13px',
          },
        },
      },

      yaxis: {
        max: maxValue,
        tickAmount: 7,
        labels: {
          offsetX: -15,
          style: {
            colors: '#6B7280',
            fontSize: '13px',
          },
        },
      },

      grid: {
        borderColor: '#e5e7eb00',
        strokeDashArray: 5,
        padding: {
          right: -13,
          left: -8,
        },
      },

      legend: { show: false },
      dataLabels: { enabled: false },

      fill: {
        opacity: [1, 1],
      },
    };

    // 👇 now it exists here
  }
  ngAfterViewInit(): void {
    this.initTicketCategoryChart();
    Promise.resolve().then(() => {
      this.performanceChart();
      this.cdr.detectChanges();
    });
  }

  performanceChart(): void {
    const totalDots = 24;
    if (!this.agentPerfEl) return;
    const filledDots =
      Number(this.agentPerfEl.nativeElement.dataset['filled']) || 0;
    this.rate_chart = {
      series: [
        {
          data: Array.from({ length: totalDots }, (_, i) => ({
            x: i + 1,
            y: 1,
            fillColor: i < filledDots ? '#F26522' : '#E5E7EB',
          })),
        },
      ],
      chart: { type: 'scatter', height: 18, sparkline: { enabled: true } },
      markers: { size: 5.5, shape: 'circle', strokeWidth: 0 },
      xaxis: { min: 0, max: totalDots + 1, labels: { show: false } },
      yaxis: { show: false },
      grid: { show: false },
      tooltip: { enabled: false },
      legend: { show: false },
    };
  }

  private initTicketCategoryChart(): void {
    const ctx = this.ticketCategoryChartRef.nativeElement.getContext('2d')!;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['IT Support', 'HR', 'Payroll', 'Access', 'Hardware', 'Other'],
        datasets: [
          {
            data: [30, 12, 10, 18, 8, 12],
            backgroundColor: [
              '#F68B4A',
              '#6E8F99',
              '#45C676',
              '#F2BE1A',
              '#4C8DFF',
              '#E53935',
            ],
            borderColor: '#ffffff',
            borderWidth: 3,
            borderRadius: 8,
            spacing: 1,
          },
        ],
      },
      options: {
        rotation: -90,
        circumference: 180,
        cutout: '72%' as any, // 👈 Chart.js typing fix

        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: { display: false },

          tooltip: {
            enabled: true,
            backgroundColor: '#111827',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 10,
            cornerRadius: 6,
            displayColors: false,

            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed}`;
              },
            },
          },
        },
      },
    };

    new Chart(ctx, config);
  }
    ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Help Desk Dashboard', active: true },
    ];
  }
}
