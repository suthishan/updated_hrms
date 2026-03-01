import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlogModalComponent } from './blog-modal/blog-modal.component';
import { FooterComponent } from '../../../../layouts/footer/footer.component';

@Component({
    selector: 'app-blogs',
    templateUrl: './blogs.component.html',
    styleUrl: './blogs.component.scss',
    imports: [RouterModule,BlogModalComponent,FooterComponent]
})
export class BlogsComponent {

}
