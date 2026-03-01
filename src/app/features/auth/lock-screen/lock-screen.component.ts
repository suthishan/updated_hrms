import { Component, Renderer2 } from '@angular/core';
import { routes } from '../../../core/routes/routes';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lock-screen',
    templateUrl: './lock-screen.component.html',
    styleUrl: './lock-screen.component.scss',
    imports: [CommonModule,RouterLink]
})
export class LockScreenComponent {
public routes=routes;
password: boolean[] = [false, false]; // Add more as needed

togglePassword(index: number): void {
  this.password[index] = !this.password[index];
}
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
