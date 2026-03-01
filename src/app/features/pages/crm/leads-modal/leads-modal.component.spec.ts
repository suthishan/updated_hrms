import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsModalComponent } from './leads-modal.component';

describe('LeadsModalComponent', () => {
  let component: LeadsModalComponent;
  let fixture: ComponentFixture<LeadsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
