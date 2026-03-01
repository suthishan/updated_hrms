import { Component } from '@angular/core';
import { routes } from '../../../core/routes/routes';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss',
    imports: [CommonModule]
})
export class SigninComponent {
  public routes = routes
  password: boolean[] = [false, false]; // Add more as needed

  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }
  constructor(private router: Router){}
  navigation(){
    this.router.navigate([routes.index])
  }
}
