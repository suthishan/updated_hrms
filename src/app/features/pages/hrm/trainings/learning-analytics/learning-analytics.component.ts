import { Component} from '@angular/core';

import { routes } from '../../../../../core/routes/routes';
import { apiResultFormat, learninganalysis, pageSelection } from '../../../../../core/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../../../../core/services/data/data.service';
import { Router, RouterLink } from '@angular/router';
import { PaginationService, tablePageSize } from '../../../../../shared/custom-pagination/pagination.service';
import { MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { CustomPaginationComponent } from '../../../../../shared/custom-pagination/custom-pagination.component';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CollapseHeaderComponent } from '../../../../../shared/collapse-header/collapse-header.component';
import { MatSelectModule } from '@angular/material/select';
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
import { ChartOptions } from 'chart.js';
@Component({
  selector: 'app-learning-analytics',
  imports:  [
      CommonModule,
      CustomPaginationComponent,
      FormsModule,
      MatSortModule,
      NgApexchartsModule,
      CollapseHeaderComponent,
      MatSelectModule,
      RouterLink,
      NgApexchartsModule
    ],
  templateUrl: './learning-analytics.component.html',
  styleUrl: './learning-analytics.component.scss',
})
export class LearningAnalyticsComponent {
   public learning_chart: Partial<ChartOptions> | any;
   public certification_chart: Partial<ChartOptions> | any;
   public course_chart: Partial<ChartOptions> | any;
 public routes = routes;
  initChecked = false;
  // pagination variables
  public pageSize = 10;
  public tableData: learninganalysis[] = [];
  public tableDataCopy: learninganalysis[] = [];
  public actualData: learninganalysis[] = [];
  public currentPage = 1;
  public skip = 0;
  public limit: number = this.pageSize;
  public serialNumberArray: number[] = [];
  public totalData = 0;
  showFilter = false;
  public pageSelection: pageSelection[] = [];
  dataSource!: MatTableDataSource<learninganalysis>;
  public searchDataValue = '';
  public password: boolean[] = [false, false, false, false];
  togglePassword(index: number) {
    this.password[index] = !this.password[index];
  }
  constructor(
    private data: DataService,
    private router: Router,
    private pagination: PaginationService,
  ) {
    this.learning_chart={
    series: [
      {
        name: 'Inprogress',
        type: 'column',
        data: [50, 70, 60, 180, 120, 90, 140, 80, 130, 100, 90, 75]
      },
      {
        name: 'Completed',
        type: 'column',
        data: [90, 130, 170, 260, 150, 130, 180, 220, 200, 280, 240, 300]
      },
      {
        name: 'Total Employees',
        type: 'line',
        data: [140, 200, 260, 460, 310, 260, 370, 340, 370, 420, 350, 430]
      }
    ],

    chart: {
      height: 320,
      type: 'line',
      stacked: true,
      toolbar: { show: false }
    },

    stroke: {
      width: [0, 0, 3],
      curve: 'smooth'
    },

    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 6
      }
    },

    markers: {
      size: 6,
      strokeWidth: 3,
      hover: { size: 7 }
    },

    colors: ['#FF7A45', '#0B3C49', '#FFC107'],

    dataLabels: {
      enabled: false
    },

    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
    },

    yaxis: {
      min: 0,
      max: 500,
      tickAmount: 5
    },

    legend: {
      position: 'bottom',
      markers: {
        radius: 12
      }
    },

    grid: {
      strokeDashArray: 4
    },

    tooltip: {
      shared: true,
      intersect: false
    }
  };
  this.certification_chart={
    series: [{
      name: 'Performance',
      data: [20, 45, 30, 60, 40, 70, 35, 55, 30, 65]
    }],

    chart: {
      type: 'area',
      height: 230,
      toolbar: { show: false },
      zoom: { enabled: false }
    },

    stroke: {
      curve: 'smooth',
      width: 4,
      colors: ['#F26522']
    },

    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#F26522',
            opacity: 0.45
          },
          {
            offset: 100,
            color: '#FFFFFF',
            opacity: 0
          }
        ]
      }
    },

    markers: {
      size: 0
    },

    dataLabels: {
      enabled: false
    },

    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },

    yaxis: {
      labels: { show: false }
    },

    grid: {
      show: false
    },

    tooltip: {
      enabled: true,
      y: {
        formatter: (val:any) => val
      }
    }
  };
  this.course_chart={
    series: [{
      name: 'Skill Level',
      data: [35, 55, 40, 15, 25, 45] // Git, HTML, Nodejs, MySQL, React, Java
    }],

    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false }
    },

    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '35%',
        borderRadius: 8,
        distributed: false
      }
    },

    colors: ['#F26522'], // Orange bar color

    dataLabels: {
      enabled: false
    },

    xaxis: {
      categories: ['Git', 'HTML', 'Nodejs', 'MySQL', 'React', 'Java'],
      min: 0,
      max: 60,
      tickAmount: 6,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },

    yaxis: {
      labels: {
        style: {
          colors: '#111827',
          fontSize: '13px',
          fontWeight: 500
        }
      }
    },

    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      }
    },

    tooltip: {
      y: {
        formatter: (val:any) => `${val} hrs`
      }
    }
  };
    this.data.getlearninganalysis().subscribe((apiRes: apiResultFormat) => {
      this.actualData = apiRes.data;
      this.pagination.tablePageSize.subscribe((res: tablePageSize) => {
        if (this.router.url == this.routes.learningAnalytics) {
          this.getTableData({ skip: res.skip, limit: res.limit });
          this.pageSize = res.pageSize;
        }
      });
    });
  }
  private getTableData(pageOption: pageSelection): void {
    this.data.getlearninganalysis().subscribe((apiRes: apiResultFormat) => {
      this.tableData = [];
      this.tableDataCopy = [];
      this.serialNumberArray = [];
      this.totalData = apiRes.totalData;
      apiRes.data.map((res: learninganalysis, index: number) => {
        const serialNumber = index + 1;
        if (index >= pageOption.skip && serialNumber <= pageOption.limit) {
          res.sNo = serialNumber;
          this.tableData.push(res);
          this.tableDataCopy.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<learninganalysis>(this.actualData);
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        tableDataCopy: this.tableDataCopy,
        serialNumberArray: this.serialNumberArray,
      });
    });
  }

  public row = true;
  public searchData(value: string): void {
    this.searchDataValue = value.trim().toLowerCase();
    this.dataSource.filter = this.searchDataValue;
    this.tableData = this.dataSource.filteredData;
    this.row = this.tableData.length > 0;

    if (this.searchDataValue !== '') {
      // Handle filtered data
      this.pagination.calculatePageSize.next({
        totalData: this.tableData.length,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.tableData.map((_, i) => i + 1), // Generates serials like [1, 2, 3...]
      });
    } else {
      // Handle reset to full data
      this.pagination.calculatePageSize.next({
        totalData: this.totalData,
        pageSize: this.pageSize,
        tableData: this.tableData,
        serialNumberArray: this.serialNumberArray,
      });
    }
  }
  public sortData(sort: Sort) {
    const data = this.tableData.slice();

    if (!sort.active || sort.direction === '') {
      this.tableData = data;
    } else {
      this.tableData = data.sort((a, b) => {
        const aValue = (a as never)[sort.active];

        const bValue = (b as never)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
  public changePageSize(pageSize: number): void {
    this.pageSelection = [];
    this.limit = pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.pagination.tablePageSize.next({
      skip: this.skip,
      limit: this.limit,
      pageSize: this.pageSize,
    });
  }
  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }
}
