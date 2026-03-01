/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild } from '@angular/core';
import { breadCrumbItems } from '../../../../core/models/models';
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
import { Chart, registerables } from 'chart.js';
import { routes } from '../../../../core/routes/routes';

import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
export interface ChartOptions  {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};
Chart.register(...registerables);
@Component({
    selector: 'app-deals-dashboard',
    templateUrl: './deals-dashboard.component.html',
    styleUrl: './deals-dashboard.component.scss',
    imports: [
    MatSelectModule,
    FormsModule,
    NgxEditorModule,
    BsDatepickerModule,
    RouterLink,
    NgApexchartsModule,
    CollapseHeaderComponent,
    BreadcrumbsComponent
]
})
export class DealsDashboardComponent implements OnInit {
  breadCrumbItems: breadCrumbItems[] =[];
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  @ViewChild('chart')
  chart!: ChartComponent;
  routes = routes
  public Areachart: Partial<ChartOptions> | any;
  public Areachart2: Partial<ChartOptions> | any;
  public pipeline_chart: Partial<ChartOptions> | any;
  public deals_stage: Partial<ChartOptions> | any;
  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }
  ngOnInit(): void {
    this.dealChart();
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Deals Dashboard', active: true }
  ];
  this.Areachart = {
    series: [{
      name: "Messages",
      data: [0,3,0,2,1,3,1]
    }],
    fill: {
      type: 'gradient',

    },
    chart: {
      foreColor: '#fff',
      type: "area",
      width: 50,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: !1
      },
      dropShadow: {
        enabled: 0,
        top: 3,
        left: 14,
        blur: 4,
        opacity: .12,
        color: "#fff"
      },
      sparkline: {
        enabled: !0
      }
    },
    markers: {
      size: 0,
      colors: ["#F26522"],
      strokeColors: "#fff",
      strokeWidth: 0,
      hover: {
        size: 7
      }
    },
    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "35%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: !0,
      width: 1,
      curve: "straight"
    },
    colors: ["#1CCE6B"],

    tooltip: {
      enabled:false,
      hideEmptySeries: true,
      onDatasetHover: {
        highlightDataSeries: false,
    },
    }
  };
  this.Areachart2 = {
    series: [{
      name: "Messages",
      data: [0,3,0,2,1,3,1]
    }],
    fill: {
      type: 'gradient',

    },
    chart: {
      foreColor: '#fff',
      type: "area",
      width: 50,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: !1
      },
      dropShadow: {
        enabled: 0,
        top: 3,
        left: 14,
        blur: 4,
        opacity: .12,
        color: "#fff"
      },
      sparkline: {
        enabled: !0
      }
    },
    markers: {
      size: 0,
      colors: ["#F26522"],
      strokeColors: "#fff",
      strokeWidth: 0,
      hover: {
        size: 7
      }
    },
    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "35%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: !0,
      width: 1,
      curve: "straight"
    },
    colors: ["#D00C0C"],

    tooltip: {
      enabled:false,
      hideEmptySeries: true,
      onDatasetHover: {
        highlightDataSeries: false,
    },
    }
  };
  this.deals_stage = {
    chart: {
      height: 310,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      }
    },
    colors: ['#FF6F28', '#F8F9FA'],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        borderRadius: 20,
        horizontal: false,
        endingShape: 'rounded'
      },
    },
    series: [{
      name: 'Income',
      data: [80, 40, 100, 20]
    }, {
      name: 'Expenses',
      data: [100, 100, 100, 100]
    }],
    xaxis: {
      categories: ['Inpipeline', 'Follow Up', 'Schedule', 'Conversion'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false // Disable data labels
    },
    fill: {
      opacity: 1
    },
  };
  this.pipeline_chart = {
    series: [{
      name: "Pipeline",
      data: [130, 110, 90, 70, 50, 40],
    }],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '100%',
        borderRadius: 10,
        borderRadiusApplication: 'around',
        isFunnel: true,
      },
    },
    colors: ['#F26522', '#F37438', '#F5844E', '#F69364', '#F7A37A', '#F9B291'],
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      formatter: function (val:any, opt:any) {
        return opt.w.globals.labels[opt.dataPointIndex]
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Public Sans, sans-serif',
        fontWeight: 500,
        colors: ['#fff']
      },
      dropShadow: { enabled: false }
    },
    xaxis: {
      categories: [
        'Marketing : 7,898', 'Sales : 4,658', 'Email : 2,898',
        'Chat : 789', 'Operational : 655', 'Calls : 454'
      ],
      min: -25,
      max: 125
    },
    tooltip: { enabled: false },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    },
    grid: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    }
  }
  }
  dealChart() {
    new Chart('dealChart', {
		  type: 'doughnut',
		  data: {
			labels: ['Email', 'Chat', 'Sales'],
			datasets: [{
			  data: [45, 25, 30],
			  backgroundColor: [
				'#3f6f7f', // blue
				'#ffc107', // yellow
				'#ff6a2c'  // orange
			  ],
			  borderWidth: 0,
			  borderRadius: 20,   // 🔥 rounded arc ends
			  spacing: 6          // 🔥 gap between segments
			}]
		  },
		  options: {
			responsive: false,
			cutout: '75%',        // 🔥 donut thickness
			plugins: {
			  legend: {
				display: false
			  },
			  tooltip: {
				enabled: false
			  }
			}
		  }
		});
  }
}
