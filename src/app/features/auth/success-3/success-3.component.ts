import { Component, Renderer2 } from '@angular/core';

import { RouterLink } from '@angular/router';
import { routes } from '../../../core/routes/routes';
import { Router } from '@angular/router';

@Component({
    selector: 'app-success-3',
    templateUrl: './success-3.component.html',
    styleUrl: './success-3.component.scss',
    imports: [RouterLink]
})
export class Success3Component {
  public routes = routes;
  constructor(private router: Router,
    private renderer: Renderer2
  ){}
  navigation(){
    this.router.navigate([routes.login3])
  }
  ngOnInit():void{
    this.renderer.addClass(document.body,'bg-linear-gradiant');
  }
  ngOnDestroy():void{
    this.renderer.removeClass(document.body,'bg-llinear-gradiant');
  }
}
