import { Component, AfterViewInit, OnDestroy, OnInit  } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { FormControl, FormGroup } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';
import { LightGallery } from 'lightgallery/lightgallery';
import { BeforeSlideDetail } from 'lightgallery/lg-events';

import { LightgalleryModule } from 'lightgallery/angular';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrl: './project-details.component.scss',
    imports: [LightgalleryModule, MatSelectModule, NgxEditorModule, RouterLink, CollapseHeaderComponent]
})
export class ProjectDetailsComponent implements AfterViewInit,OnInit, OnDestroy {
  routes = routes
  editor!: Editor;
  private needRefresh = false;
  private lightGallery!: LightGallery;
  toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });

  settings = {
    counter: false,
    plugins: [lgZoom, lgVideo],
  };
  toggleStrike() {
    const todoItem = document.getElementById('todoItem');
    if (todoItem) {
      todoItem.classList.toggle('todo-strike-content');
    }
  }
  ngOnInit(): void {

    this.editor = new Editor();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  ngAfterViewInit() {
    // Select and add click event for '.todo-item input'
    document.querySelectorAll('.todo-item input').forEach(input => {
      input.addEventListener('click', () => {
        input.parentElement?.parentElement?.classList.toggle('todo-strike');
      });
    });

    // Select and add click event for '.todo-inbox-check input'
    document.querySelectorAll('.todo-inbox-check input').forEach(input => {
      input.addEventListener('click', () => {
        input.parentElement?.parentElement?.classList.toggle('todo-strike-content');
      });
    });

    // Select and add click event for '.todo-list input'
    document.querySelectorAll('.todo-list input').forEach(input => {
      input.addEventListener('click', () => {
        input.parentElement?.parentElement?.classList.toggle('todo-strike-content');
      });
    });
    if (this.needRefresh) {
      this.lightGallery.refresh();
      this.needRefresh = false;
    }
  }
  onInit = (detail: { instance: LightGallery }): void => {
    this.lightGallery = detail.instance;
  };
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, prevIndex } = detail;
  };
}
