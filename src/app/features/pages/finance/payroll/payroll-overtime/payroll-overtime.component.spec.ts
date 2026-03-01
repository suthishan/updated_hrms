import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOvertimeComponent } from './payroll-overtime.component';

describe('PayrollOvertimeComponent', () => {
  let component: PayrollOvertimeComponent;
  let fixture: ComponentFixture<PayrollOvertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollOvertimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOvertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
