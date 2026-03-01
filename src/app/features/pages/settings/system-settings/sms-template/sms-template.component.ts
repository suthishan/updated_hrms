import { Component } from '@angular/core';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'app-sms-template',
    templateUrl: './sms-template.component.html',
    styleUrl: './sms-template.component.scss',
    imports: [MatSelectModule, NgxEditorModule]
})
export class SmsTemplateComponent {
  editor!: Editor;
  editor1!: Editor;
  ngOnInit():void{
    this.editor = new Editor();
    this.editor1 = new Editor();
  }

 toolbar: Toolbar = [
    ['bold', 'italic', 'format_clear'],
    ['underline', 'strike'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['image'],
  ];
}
