import { Component } from '@angular/core';
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
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { RouterLink } from '@angular/router';
import { routes } from '../../../../core/routes/routes';
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
  selector: 'app-tenant-support-tickets',
  imports: [NgApexchartsModule,CollapseHeaderComponent,MatSelectModule,TagInputModule,FormsModule,RouterLink],
  templateUrl: './tenant-support-tickets.component.html',
  styleUrl: './tenant-support-tickets.component.scss',
})
export class TenantSupportTicketsComponent {
  routes = routes
  public tenent_chart: Partial<ChartOptions> | any;
  public tenent_chart2: Partial<ChartOptions> | any;
  public tenent_chart3: Partial<ChartOptions> | any;
  public tenent_chart4: Partial<ChartOptions> | any;
  values: string[] = ['Vaughan Lewis'];
  constructor(){
    this.tenent_chart={
    chart: {
      width: 50,
      height: 115,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    // Ensure the primary color is defined in both colors and fill
    colors: ['#0C4B5E'],
    fill: {
      colors: ['#0C4B5E'],
      opacity: 1
    },
    series: [{
      name: 'New',
      data: [60]
    }],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%', // Helps visibility for single bars
        colors: {
          backgroundBarColors: ['#F8F9FA'],
          backgroundBarOpacity: 0.5,
          backgroundBarRadius: 10
        }
      }
    },
    // STATES: This is required to make the active/hover color work
    states: {
      normal: { filter: { type: 'none' } },
      hover: {
        filter: { type: 'darken', value: 0.8 } // Darkens current color on hover
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: 'none' }
      }
    },
    dataLabels: {
      enabled: true, // Must be true
      formatter: function (val:any) {
        return val + "%"; // Display the raw value
      },
      offsetY: 0, // Adjust this value to nudge the text up or down from the bottom
      style: {
        fontSize: '12px',
        colors: ['#fff'], // Gray color to match your design
        fontWeight: 'bold'
      }
    },
    xaxis: {
      categories: ['Day'], // Adding a category helps Apex recognize the single point
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false, min: 0, max: 100 },
    grid: { show: false },
    tooltip: { enabled: true }
  };
  this.tenent_chart2 ={
    chart: {
      width: 50,
      height: 115,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    // Ensure the primary color is defined in both colors and fill
    colors: ['#AB47BC'],
    fill: {
      colors: ['#AB47BC'],
      opacity: 1
    },
    series: [{
      name: 'open',
      data: [30]
    }],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%', // Helps visibility for single bars
        colors: {
          backgroundBarColors: ['#F7EEF9'],
          backgroundBarOpacity: 0.5,
          backgroundBarRadius: 10
        }
      }
    },
    // STATES: This is required to make the active/hover color work
    states: {
      normal: { filter: { type: 'none' } },
      hover: {
        filter: { type: 'darken', value: 0.8 } // Darkens current color on hover
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: 'none' }
      }
    },
    dataLabels: {
      enabled: true, // Must be true
      formatter: function (val:any) {
        return val + "%"; // Display the raw value
      },
      offsetY: 0, // Adjust this value to nudge the text up or down from the bottom
      style: {
        fontSize: '12px',
        colors: ['#fff'], // Gray color to match your design
        fontWeight: 'bold'
      }
    },
    xaxis: {
      categories: ['Day'], // Adding a category helps Apex recognize the single point
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false, min: 0, max: 100 },
    grid: { show: false },
    tooltip: { enabled: true }
  };
  this.tenent_chart3={
    chart: {
      width: 50,
      height: 115,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    // Ensure the primary color is defined in both colors and fill
    colors: ['#0DCAF0'],
    fill: {
      colors: ['#0DCAF0'],
      opacity: 1
    },
    series: [{
      name: 'Pending',
      data: [50]
    }],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%', // Helps visibility for single bars
        colors: {
          backgroundBarColors: ['#E9FAFE'],
          backgroundBarOpacity: 0.5,
          backgroundBarRadius: 10
        }
      }
    },
    // STATES: This is required to make the active/hover color work
    states: {
      normal: { filter: { type: 'none' } },
      hover: {
        filter: { type: 'darken', value: 0.8 } // Darkens current color on hover
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: 'none' }
      }
    },
    dataLabels: {
      enabled: true, // Must be true
      formatter: function (val:any) {
        return val + "%"; // Display the raw value
      },
      offsetY: 0, // Adjust this value to nudge the text up or down from the bottom
      style: {
        fontSize: '12px',
        colors: ['#fff'], // Gray color to match your design
        fontWeight: 'bold'
      }
    },
    xaxis: {
      categories: ['Day'], // Adding a category helps Apex recognize the single point
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false, min: 0, max: 100 },
    grid: { show: false },
    tooltip: { enabled: true }
  };
  this.tenent_chart4 ={
    chart: {
      width: 50,
      height: 115,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    // Ensure the primary color is defined in both colors and fill
    colors: ['#03C95A'],
    fill: {
      colors: ['#03C95A'],
      opacity: 1
    },
    series: [{
      name: 'Solved',
      data: [80]
    }],
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%', // Helps visibility for single bars
        colors: {
          backgroundBarColors: ['#EAF8F0'],
          backgroundBarOpacity: 0.5,
          backgroundBarRadius: 10
        }
      }
    },
    // STATES: This is required to make the active/hover color work
    states: {
      normal: { filter: { type: 'none' } },
      hover: {
        filter: { type: 'darken', value: 0.8 } // Darkens current color on hover
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: { type: 'none' }
      }
    },
    dataLabels: {
      enabled: true, // Must be true
      formatter: function (val:any) {
        return val + "%"; // Display the raw value
      },
      offsetY: -20, // Adjust this value to nudge the text up or down from the bottom
      style: {
        fontSize: '12px',
        colors: ['#fff'], // Gray color to match your design
        fontWeight: 'bold'
      }
    },
    xaxis: {
      categories: ['Day'], // Adding a category helps Apex recognize the single point
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: { show: false, min: 0, max: 100 },
    grid: { show: false },
    tooltip: { enabled: true }
  };
  }
}
