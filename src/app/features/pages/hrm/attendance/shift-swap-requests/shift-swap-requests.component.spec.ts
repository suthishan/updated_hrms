import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSwapRequestsComponent } from './shift-swap-requests.component';

describe('ShiftSwapRequestsComponent', () => {
  let component: ShiftSwapRequestsComponent;
  let fixture: ComponentFixture<ShiftSwapRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftSwapRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftSwapRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
