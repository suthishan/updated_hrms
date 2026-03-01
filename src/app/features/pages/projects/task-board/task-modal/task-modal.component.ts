import { Component ,  OnDestroy,
  OnInit} from '@angular/core';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { TagInputModule } from 'ngx-chips';
@Component({
    selector: 'app-task-modal',
    templateUrl: './task-modal.component.html',
    styleUrl: './task-modal.component.scss',
    imports: [NgxEditorModule, MatSelectModule, FormsModule, TagInputModule]
})
export class TaskModalComponent implements OnInit, OnDestroy {
  values: string[] =['Jerald']
  values2: string[] = ['Jerald', 'Andrew', 'Philip', 'Davis'];
  values3: string[] = ['Collab'];
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
  }
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
  }
}
