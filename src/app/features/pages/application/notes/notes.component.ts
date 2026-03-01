import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { CollapseHeaderComponent } from '../../../../shared/collapse-header/collapse-header.component';
import { RouterLink } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrl: './notes.component.scss',
    imports: [NgxEditorModule, MatSelectModule, FormsModule, CollapseHeaderComponent,FooterComponent, RouterLink, TagInputModule, BsDatepickerModule]
})
export class NotesComponent {
public routes = routes
  selectedValue1 = '';
  selectedValue2 = '';
  selectedValue3 = '';
  selectedValue4 = '';
  selectedValue5 = '';
  selectedValue6 = '';
  selectedValue7 = '';
  selectedValue8 = '';
  selectedValue9 = '';
  public appSidebar = true;
  text: string | undefined;
  values3: string[] = ['Dwight'];
  values1: string[] = ['Pending','Done'];
  toggleChange() {
    this.appSidebar = !this.appSidebar;
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
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.editor1.destroy();
  }
}
