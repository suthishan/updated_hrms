import { Component } from '@angular/core';
import { routes } from '../../../../../../core/routes/routes';

import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';


@Component({
    selector: 'app-form-fileupload',
    templateUrl: './form-fileupload.component.html',
    styleUrls: ['./form-fileupload.component.scss'],
    imports: [FormsModule, DragDropModule, NgxDropzoneModule]
})
export class FormFileuploadComponent {
  public routes = routes;
  singleFile: File[] = [];
  multipleFiles: File[] = [];

  onSingleSelect(event: { addedFiles: File[] }) {
    this.singleFile = [];
    this.singleFile.push(...event.addedFiles);
  }

  onMultipleSelect(event: { addedFiles: File[] }) {
    this.multipleFiles.push(...event.addedFiles);
  }

  onRemoveSingle(event: File) {
    this.singleFile.splice(this.singleFile.indexOf(event), 1);
  }

  onRemoveMultiple(event: File) {
    this.multipleFiles.splice(this.multipleFiles.indexOf(event), 1);
  }
}
