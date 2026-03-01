import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollDeductionComponent } from './payroll-deduction.component';

describe('PayrollDeductionComponent', () => {
  let component: PayrollDeductionComponent;
  let fixture: ComponentFixture<PayrollDeductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollDeductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollDeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
