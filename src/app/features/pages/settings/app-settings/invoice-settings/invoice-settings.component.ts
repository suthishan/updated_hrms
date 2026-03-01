
import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
    selector: 'app-invoice-settings',
    templateUrl: './invoice-settings.component.html',
    styleUrl: './invoice-settings.component.scss',
    imports: [NgxEditorModule, MatSelectModule]
})
export class InvoiceSettingsComponent {
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
