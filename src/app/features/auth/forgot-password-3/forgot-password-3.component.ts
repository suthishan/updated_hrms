import { Component, Renderer2 } from '@angular/core';
import { routes } from '../../../core/routes/routes';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector: 'app-forgot-password-3',
    templateUrl: './forgot-password-3.component.html',
    styleUrl: './forgot-password-3.component.scss',
    imports: [RouterLink]
})
export class ForgotPassword3Component {
  public routes = routes;

  constructor(
    private router: Router,
    private renderer:Renderer2
  ){}
  navigation(){
    this.router.navigate([routes.index])
  }
  ngOnInit(): void {
    this.renderer.addClass(document.body, 'bg-linear-gradiant');
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-linear-gradiant');
  }
}
