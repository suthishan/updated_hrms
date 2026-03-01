import { Component } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { routes } from '../../../../../core/routes/routes';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-validation',
    templateUrl: './form-validation.component.html',
    styleUrls: ['./form-validation.component.scss'],
    imports: [CommonModule,FormsModule,ReactiveFormsModule]
})
export class FormValidationComponent {
  public routes = routes;
  myForm!: FormGroup;
  myForm1!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
    this.myForm1 = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form Submitted!', this.myForm.value);
    } else {
      this.myForm.markAllAsTouched(); // Trigger validation messages
    }
  }
  onSubmit1(): void {
    if (this.myForm1.valid) {
      console.log('Form Submitted!', this.myForm1.value);
    } else {
      this.myForm1.markAllAsTouched(); // Trigger validation messages
    }
  }
 
}
