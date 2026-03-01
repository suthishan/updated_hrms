import { Component } from '@angular/core';
import { routes } from '../../../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../layouts/footer/footer.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink } from '@angular/router';
@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    imports:[CommonModule,FooterComponent,NgScrollbarModule,RouterLink]
})
export class EmailComponent {

  public routes = routes;
  showCompose = false;
  showEmail = false;
  showLabels = false;
  showFolder = false;
  displayCompose() {
    this.showCompose = !this.showCompose;
  }
  showMoreEmail() {
    this.showEmail = !this.showEmail;
  }
  showMoreLabel() {
    this.showLabels = !this.showLabels;
  }
  showMoreFolder() {
    this.showFolder = !this.showFolder;
  }


}
