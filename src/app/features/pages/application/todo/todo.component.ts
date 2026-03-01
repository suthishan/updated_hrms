import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { routes } from '../../../../core/routes/routes';
import { CommonService } from '../../../../core/services/common/common.service';
import { breadCrumbItems } from '../../../../core/models/models';

import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../../../shared/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
interface data {
  value: string;
}

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss',
    imports: [MatSelectModule, NgxEditorModule, BsDatepickerModule, CollapseHeaderComponent,FooterComponent, RouterLink, BreadcrumbsComponent]
})
export class TodoComponent implements OnInit, OnDestroy {
  public routes = routes
  breadCrumbItems: breadCrumbItems[] =[];
  public selectedValue1 = '';
  public selectedValue2 = '';
  public selectedValue3 = '';
  public selectedValue4 = '';
  public selectedValue5 = '';
  public selectedValue6 = '';
  public selectedValue8 = '';
  public selectedValue7 = '';
  public selectedValue9 = '';
  public selectedValue10 = '';
  public selectedValue11 = '';
  public selectedValue12 = '';
  public selectedValue13 = '';
  selectedList1: data[] = [
    { value: 'Bulk Actions' },
    { value: 'Delete Marked' },
    { value: 'Unmark All' },
    { value: 'Mark All' },
  ];
  selectedList2: data[] = [
    { value: 'Recent' },
    { value: 'Last Modified' },
    { value: 'Unmark All' },
    { value: 'Last Modified by me' },
  ];
  selectedList5: data[] = [
    { value: 'Sort by Date' },
    { value: 'Ascending' },
    { value: 'Descending' },
    { value: 'Recently Viewed' },
    { value: 'Recently Added' },
    { value: 'Creation Date ' },
  ];
  selectedList6: data[] = [
    { value: 'Choose' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];
  selectedList7: data[] = [
    { value: 'Onhold' },
    { value: 'Onhold' },
    { value: 'Onhold' },
  ];
  selectedList8: data[] = [
    { value: 'High' },
    { value: 'Medium' },
    { value: 'Low' },
  ];
  selectedList9: data[] = [
    { value: 'Select' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];
  selectedList10: data[] = [
    { value: 'Choose' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];
  selectedList11: data[] = [
    { value: 'Select' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];
  selectedList12: data[] = [
    { value: 'Select' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];
  selectedList13: data[] = [
    { value: 'Select' },
    { value: 'Recent1' },
    { value: 'Recent2' },
  ];

  today!: Date;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  constructor(
    private common: CommonService,
    private renderer: Renderer2
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  editor!: Editor;
  editor1!: Editor;
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
    this.editor1 = new Editor();
    this.today = new Date();
    this.breadCrumbItems = [
      { label: 'Application' },
      { label: 'Todo', active: true }
  ];
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
  public appSidebar = true;

  toggleChange() {
    this.appSidebar = !this.appSidebar;
  }
}
