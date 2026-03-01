/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
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
import { BsDatepickerDirective, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Chart, registerables } from 'chart.js';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { breadCrumbItems } from '../../../../core/models/models';
import { routes } from '../../../../core/routes/routes';
import { CommonService } from '../../../../core/services/common/common.service';
import { SettingService } from '../../../../core/services/settings/settings.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { TagInputModule } from 'ngx-chips';
import { DatePickerModule } from 'primeng/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
}

Chart.register(...registerables);
@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
    imports: [
      CommonModule,
      MatSelectModule,
      FormsModule,
      NgxEditorModule,
      BsDatepickerModule,
      RouterLink,
      NgApexchartsModule,
      CollapseHeaderComponent,
      BreadcrumbsComponent,
      TagInputModule,
      DatePickerModule,
      TimepickerModule
    ]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  routes = routes;
  base = '';
  values: string[] = ['Jerald', 'Andrew', 'Philip', 'Davis'];
  values2: string[] = ['Hendry', 'James'];
  values3: string[] = ['Dwight'];
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker?: BsDatepickerDirective;
  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker?.hide();
  }
  public EmpDepartment: Partial<ChartOptions> | any;
  public SalesIncome: Partial<ChartOptions> | any;
  breadCrumbItems: breadCrumbItems[] = [];
  bsConfig: Partial<BsDatepickerConfig>;
  selectedYear: Date | undefined;
  selectedTime: Date = new Date(); // Default time
  dropdownOpen = false;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  selectedFieldSet: number[] = [0];
  nextStep() {
    if (this.selectedFieldSet[0] < 13) {
      this.selectedFieldSet[0]++;
    }
  }
  previousStep() {
    if (this.selectedFieldSet[0] > 0) {
      // Move to the previous step
      this.selectedFieldSet[0]--;
    }

  }
  constructor(private common: CommonService,private layout:SettingService) {
  this.selectedYear = new Date(); // or default like new Date(2025, 0, 1)

this.bsConfig = {
  minMode: 'month',          // 👈 switch from 'year' to 'month'
  dateInputFormat: 'MMM YYYY', // 👈 Jan 2025 format
};



  }

  // Open the dropdown
  openDropdown() {
    this.dropdownOpen = true;
  }

  // Close the dropdown
  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Update displayed time when selection changes
  onTimeChange() {
    this.closeDropdown(); // Close dropdown after time selection
  }
  ngOnInit(): void {
    this.editor = new Editor();
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Admin Dashboard', active: true },
    ];
    this.editor = new Editor();
    this.EmpDepartment = {
      chart: {
        height: 220,
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
      colors: ['#F26522'],
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
          barHeight: '35%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      series: [
        {
          data: [80, 110, 80, 20, 60, 100],
          name: 'Employee',
        },
      ],
      xaxis: {
        categories: [
          'UI/UX',
          'Development',
          'Management',
          'HR',
          'Testing',
          'Marketing',
        ],
        labels: {
          style: {
            colors: '#111827',
            fontSize: '13px',
          },
        },
      },
    };
    this.SalesIncome = {
    chart: {
      height: 290,
      type: 'bar',
      stacked: true,
      toolbar: { show: false }
    },
    colors: ['#FF6F28', '#F8F9FA'],
    plotOptions: {
      bar: {
        columnWidth: '60%',       // Adjust for a cleaner pill-shape look
        borderRadius: 5,         // RADIUS FOR PILL EFFECT
        borderRadiusWhenStacked: 'all', // ENABLES INLINE ROUNDING FOR ALL SEGMENTS
        borderRadiusApplication: 'around', // ROUNDS TOP AND BOTTOM OF INLINE SEGMENTS
        horizontal: false,
      },
    },
    // Keep your existing series, xaxis, yaxis, grid, and tooltip configuration...
    series: [{
      name: 'Income',
      data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80]
    }, {
      name: 'Expenses',
      data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20]
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '13px',
        }
      }
    },
    yaxis: {
      labels: { offsetX: -15, style: { colors: '#6B7280', fontSize: '13px' } }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 5,
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      theme: 'dark',
      custom: function ({ series, dataPointIndex }: { series :any, dataPointIndex :any } ) {
        var incomeStr = '$' + Math.round(series[0][dataPointIndex]) + 'K';
        var expensesStr = '$' + Math.round(series[1][dataPointIndex]) + 'K';
        return (
          '<div style="background:#1F2937; color:#ffffff; padding:10px 14px; border-radius:8px; min-width:165px;">' +
            '<div style="display:flex; justify-content:space-between;"><span>Income</span><span>' + incomeStr + '</span></div>' +
            '<div style="display:flex; justify-content:space-between;"><span>Expenses</span><span>' + expensesStr + '</span></div>' +
          '</div>'
        );
      }
    }
  };
    this.attendancedoughcharts();
    this.mySemiDonutChart();
  }

  attendancedoughcharts() {
    new Chart('attendancedoughcharts1', {
      type: 'doughnut', // Chart type
      data: {
        labels: ['Late', 'Present', 'Permission', 'Absent'],
        datasets: [
          {
            label: 'Semi Donut',
            data: [40, 20, 30, 10],
            backgroundColor: ['#0C4B5E', '#03C95A', '#FFC107', '#E70D0D'],
            borderWidth: 5,
            borderRadius: 10,
            borderColor: '#fff', // Border between segments
            hoverBorderWidth: 0, // Border radius for curved edges
          },
        ],
      },

      options: {
        cutout: '60%',
        rotation: -100,
        circumference: 200,
        layout: {
          padding: {
            top: -20, // Set to 0 to remove top padding
            bottom: -20, // Set to 0 to remove bottom padding
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
      },
    });
  }
  mySemiDonutChart() {
    new Chart('mySemiDonutChart1', {
      type: 'doughnut', // Chart type
      data: {
        labels: ['Ongoing', 'Onhold', 'Completed', 'Overdue'],
        datasets: [
          {
            label: 'Semi Donut',
            data: [20, 40, 20, 10],
            backgroundColor: ['#FFC107', '#1B84FF', '#03C95A', '#E70D0D'],
            borderWidth: -10,
            borderColor: 'transparent', // Border between segments
            hoverBorderWidth: 0, // Border radius for curved edges
            spacing: -30,
          },
        ],
      },
      options: {
        cutout: '75%',
        rotation: -100,
        circumference: 185,
        layout: {
          padding: {
            top: -20, // Set to 0 to remove top padding
            bottom: 20, // Set to 0 to remove bottom padding
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
        elements: {
          arc: {
            borderWidth: -30, // Ensure consistent overlap
            borderRadius: 30, // Add some rounding
          },
        },
      },
    });
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
