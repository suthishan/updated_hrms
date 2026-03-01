import { Component } from '@angular/core';
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
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
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
  selector: 'app-asset-dashboard',
  imports: [NgApexchartsModule,CollapseHeaderComponent,BreadcrumbsComponent],
  templateUrl: './asset-dashboard.component.html',
  styleUrl: './asset-dashboard.component.scss',
})
export class AssetDashboardComponent {
  routes = routes
  public purchase_chart: Partial<ChartOptions> | any;
  public asset_chart: Partial<ChartOptions> | any;
  public asset1_chart: Partial<ChartOptions> | any;
  public asset2_chart: Partial<ChartOptions> | any;
  public asset3_chart: Partial<ChartOptions> | any;
  public asset4_chart: Partial<ChartOptions> | any;
  public depricated_chart: Partial<ChartOptions> | any;
  public assetCategory_chart: Partial<ChartOptions> | any;
  breadCrumbItems =[{}];
  constructor() {
    this.purchase_chart = {
      chart: {
        height: 253,
        type: 'area',
        toolbar: { show: false },
      },

      series: [
        {
          name: 'Sales',
          data: [
            1800, 2600, 4500, 7600, 6900, 7600, 6200, 8000, 7300, 5400, 6000,
            5400,
          ],
        },
      ],

      stroke: {
        curve: 'stepline',
        width: 2,
        colors: ['#FF6F28'],
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: '#FF6F28',
              opacity: 0.35,
            },
            {
              offset: 100,
              color: '#FF6F28',
              opacity: 0.05,
            },
          ],
        },
      },

      markers: {
        size: 0,
      },

      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '13px',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },

      yaxis: {
        min: 0,
        max: 8000,
        tickAmount: 4,
        forceNiceScale: true,
        labels: {
          formatter: function (val: any) {
            return Math.round(val / 1000) + 'K';
          },
          style: {
            colors: '#6B7280',
            fontSize: '13px',
          },
          offsetX: -15,
        },
      },

      grid: {
        borderColor: '#ffffff00',
        strokeDashArray: 5,
        padding: {
          left: 0,
        },
      },

      tooltip: {
        custom: function ({
          series,
          seriesIndex,
          dataPointIndex,
        }: {
          series: any;
          seriesIndex: any;
          dataPointIndex: any;
        }) {
          if (dataPointIndex === -1) return '';

          const value = series[seriesIndex][dataPointIndex];
          const formatted = (value / 1000).toFixed(1) + 'K';

          return `
      <div style="
        background:#000;
        color:#fff;
        padding:6px 10px;
        border-radius:6px;
        font-size:12px;
      ">
        ${formatted}
      </div>
    `;
        },
      },

      annotations: {
        xaxis: [
          {
            x: 'Jun',
            strokeDashArray: 0,
            borderColor: '#FF6F28',
            fillColor: '#FF6F28',
            opacity: 1,
            width: 30,
            label: {
              text: '7.6K',
              position: 'top',
              offsetY: -8,
              style: {
                background: '#000',
                color: '#fff',
                fontSize: '12px',
                padding: {
                  left: 8,
                  right: 8,
                  top: 4,
                  bottom: 4,
                },
                borderRadius: 6,
                rotate: -90,
              },
            },
          },
        ],
      },

      legend: { show: false },
      dataLabels: { enabled: false },
    };
    this.asset_chart = {
      chart: {
        height: 296,
        type: 'bar',
        padding: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#0C4B5E'],
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 5,
        padding: {
          top: -20,
          left: 0,
          right: 0,
          bottom: 0,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: true,
          barHeight: '85%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          data: [80, 110, 80, 20],
          name: 'Employee',
        },
      ],
      xaxis: {
        categories: ['HR', 'Finance', 'Operations', 'Sales'],
        labels: {
          style: {
            colors: '#111827',
            fontSize: '13px',
          },
        },
      },
    };
    this.asset1_chart = {
      series: [
        {
          name: 'Assets',
          data: [
            14, 18, 12, 22, 16, 24, 28, 15, 20, 14, 18, 11, 13, 23, 25, 26, 17,
            14, 12, 24, 16, 12, 10, 20, 18, 15, 12, 18,
          ],
        },
      ],

      chart: {
        type: 'bar',
        height: 116,
        width: '100%',
        parentHeightOffset: 0,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '80%',
          distributed: true,
        },
      },

      colors: [
        ({ dataPointIndex }: { dataPointIndex: any }) =>
          dataPointIndex === 23 ? '#F26522' : '#F2F4F7',
      ],

      dataLabels: { enabled: false },
      legend: { show: false },

      grid: {
        show: false,
        padding: {
          left: -10,
          right: -15,
          bottom: -8,
          top: -50,
        },
      },

      xaxis: {
        categories: [
          '',
          '',
          '',
          '01-08',
          '',
          '',
          '',
          '',
          '',
          '',
          '09-16',
          '',
          '',
          '',
          '',
          '',
          '',
          '16-24',
          '',
          '',
          '',
          '',
          '',
          '',
          '25-30',
        ],
        labels: {
          rotate: 0,

          rotateAlways: false,

          hideOverlappingLabels: true,

          style: {
            colors: '#9CA3AF',

            fontSize: '12px',

            fontFamily: 'inherit',

            fontWeight: 400,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },

      yaxis: { show: false },
      tooltip: { enabled: false },

      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
    };
    this.asset2_chart = {
      series: [
        {
          name: 'Assets',
          data: [
            14, 18, 12, 22, 16, 24, 28, 15, 20, 14, 18, 11, 13, 23, 25, 26, 17,
            14, 12, 24, 16, 12, 10, 20, 18, 15, 12, 18,
          ],
        },
      ],

      chart: {
        type: 'bar',
        height: 116,
        width: '100%',
        parentHeightOffset: 0,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '80%',
          distributed: true,
        },
      },

      colors: [
        ({ dataPointIndex }: { dataPointIndex: any }) =>
          dataPointIndex === 14 ? '#0C4B5E' : '#F2F4F7',
      ],

      dataLabels: { enabled: false },
      legend: { show: false },

      grid: {
        show: false,
        padding: {
          left: -10,
          right: -15,
          bottom: -8,
          top: -50,
        },
      },

      xaxis: {
        categories: [
          '',
          '',
          '',
          '01-08',
          '',
          '',
          '',
          '',
          '',
          '',
          '09-16',
          '',
          '',
          '',
          '',
          '',
          '',
          '16-24',
          '',
          '',
          '',
          '',
          '',
          '',
          '25-30',
        ],
        labels: {
          rotate: 0,

          rotateAlways: false,

          hideOverlappingLabels: true,

          style: {
            colors: '#9CA3AF',

            fontSize: '12px',

            fontFamily: 'inherit',

            fontWeight: 400,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },

      yaxis: { show: false },
      tooltip: { enabled: false },

      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
    };
    this.asset3_chart = {
      series: [
        {
          name: 'Assets',
          data: [
            14, 18, 12, 22, 16, 24, 28, 15, 20, 14, 18, 11, 13, 23, 25, 26, 17,
            14, 12, 24, 16, 12, 10, 20, 18, 15, 12, 18,
          ],
        },
      ],

      chart: {
        type: 'bar',
        height: 116,
        width: '100%',
        parentHeightOffset: 0,
        toolbar: { show: false },
      },

      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '80%',
          distributed: true,
        },
      },

      colors: [
        ({ dataPointIndex }: { dataPointIndex: any }) =>
          dataPointIndex === 20 ? '#AB47BC' : '#F2F4F7',
      ],

      dataLabels: { enabled: false },
      legend: { show: false },

      grid: {
        show: false,
        padding: {
          left: -10,
          right: -15,
          bottom: -8,
          top: -50,
        },
      },

      xaxis: {
        categories: [
          '',
          '',
          '',
          '01-08',
          '',
          '',
          '',
          '',
          '',
          '',
          '09-16',
          '',
          '',
          '',
          '',
          '',
          '',
          '16-24',
          '',
          '',
          '',
          '',
          '',
          '',
          '25-30',
        ],
        labels: {
          rotate: 0,

          rotateAlways: false,

          hideOverlappingLabels: true,

          style: {
            colors: '#9CA3AF',

            fontSize: '12px',

            fontFamily: 'inherit',

            fontWeight: 400,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },

      yaxis: { show: false },
      tooltip: { enabled: false },

      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
    };
    const totalBlocks = 30;
    const filledBlocks = 15;
    this.asset4_chart = {
      series: [
        {
          data: Array.from({ length: totalBlocks }, (_, i) => {
            if (i === filledBlocks - 1) return 1.6; // 🔥 ONE TALL BAR
            return 1;
          }),
        },
      ],

      chart: {
        type: 'bar',
        height: 65,
        toolbar: { show: false },
        sparkline: { enabled: false },
      },

      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '75%',
          borderRadius: 3,
        },
      },

      colors: [
        ({
          seriesIndex,
          dataPointIndex,
        }: {
          seriesIndex: any;
          dataPointIndex: any;
        }) => (dataPointIndex < filledBlocks ? '#F26522' : '#F2F4F7'),
      ],

      dataLabels: { enabled: false },

      grid: {
        show: false,
        padding: { top: 8, bottom: -6 },
      },

      xaxis: {
        categories: Array(totalBlocks).fill(''),
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },

      yaxis: {
        show: false,
        min: 0,
        max: 1.6,
      },

      tooltip: { enabled: false },
      legend: { show: false },

      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } },
      },
    };
    this.depricated_chart = {
      chart: {
        width: 100,
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
    this.assetCategory_chart = {
      series: [40, 20, 15, 15, 5],
      chart: {
        type: 'pie',
        height: 290,
      },

      labels: ['Laptops', 'Mouse', 'Writing Pad', 'Keyboard', 'Chairs'],

      colors: ['#3B7080', '#7fa2ad', '#9fb9c2', '#b7ccd3', '#d3e1e6'],

      legend: { show: false },

      dataLabels: { enabled: false },

      stroke: {
        width: 0,
      },
    };
  }
  ngOnInit():void{
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Asset Management', active: true },
    ];
  }
}
