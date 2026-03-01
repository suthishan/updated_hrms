import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollModalComponent } from './payroll-modal.component';

describe('PayrollModalComponent', () => {
  let component: PayrollModalComponent;
  let fixture: ComponentFixture<PayrollModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayrollModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
