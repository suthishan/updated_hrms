import { Component, ViewChild } from '@angular/core';

import { routes } from '../../../../core/routes/routes';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormControl, FormGroup } from '@angular/forms';
import * as Plyr from 'plyr';
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
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
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
    selector: 'app-file-manager',
    templateUrl: './file-manager.component.html',
    styleUrl: './file-manager.component.scss',
    imports: [NgxEditorModule, NgApexchartsModule, CollapseHeaderComponent, RouterLink,FooterComponent]
})
export class FileManagerComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public storageChart: Partial<ChartOptions> | any;
  public routes = routes
  public player!: Plyr;

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

  ngOnInit(): void {
    this.editor = new Editor();
    this.storageChart  = {
      chart: {
        height: 200,
        type: 'donut',
        toolbar: {
          show: false,
        },
        offsetY: -10,
        events: {
          rendered: function () {
            // Adding the center text
            var chartElement:any = document.querySelector("#donutChart");
            var innerText = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">' +
              '<span style="font-size: 24px; font-weight: bold;">Total</span><br>' +
              '<span style="font-size: 16px;">abb</span>' +
              '</div>';
            chartElement.innerHTML += innerText;
          }
        },
      },
      plotOptions: {
        pie: {
          startAngle: -100,
          endAngle: 100,
          donut: {
            size: '80%',
            labels: {
              show: true,
              name: {
                show: true,
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        show: false
      },
      colors: ['#0C4B5E', '#FFC107', '#1B84FF', '#AB47BC', '#FD3995'],
      series: [20, 20, 20, 20, 20],
      labels: ['Documents', 'Video', 'Music', 'Photos', 'Other'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      grid: {
        padding: {
          bottom: -60  // Reduce padding from the bottom
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
