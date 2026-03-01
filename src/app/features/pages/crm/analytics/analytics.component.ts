/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
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
} from 'ng-apexcharts';

import { NgApexchartsModule } from 'ng-apexcharts';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterLink } from '@angular/router';
export interface ChartOptions  {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss',
    imports: [NgApexchartsModule, BreadcrumbsComponent, CollapseHeaderComponent, BsDatepickerModule, RouterLink]
})
export class AnalyticsComponent implements OnInit{
  @ViewChild('chart')
  chart!: ChartComponent;
routes = routes
breadCrumbItems: breadCrumbItems[] =[];
public deals_stage: Partial<ChartOptions> | any;
public donut_chart_2: Partial<ChartOptions> | any;
today!: Date;
constructor(private renderer:Renderer2) {
  this.breadCrumbItems = [
    { label: 'CRM' },
    { label: 'Analytics', active: true }
];
}
ngOnInit(): void {
  this.renderer.addClass(document.body,'custom-daterange-picker')
  this.today = new Date();
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
        borderRadius: 5,
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
  }
  this.donut_chart_2 = {
    series: [25, 30, 10, 35], // Percentages for each section
    chart: {
        type: 'donut',
        height: 185,
    },
    labels: ['Paid', 'Google', 'Referals', 'Campaigns'], // Labels for the data
    colors: ['#FFC107', '#0C4B5E', '#AB47BC', '#FD3995'], // Colors from the image
    plotOptions: {
        pie: {
            donut: {
                size: '60%',
                labels: {
                    show: true,
                    total: {
                        show: true,
                        label: 'Google',
                        formatter: function () {
                            return '40%';
                        }
                    }
                }
            }
        }
    },
    stroke: {
      lineCap: 'round',
      show: true,
      width: 0,    // Space between donut sections
      colors: '#fff'
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false
    },
    label: {
      show: false,
    }
    }
}
ngOnDestroy():void{
  this.renderer.removeClass(document.body,'custom-daterange-picker')
}
}
