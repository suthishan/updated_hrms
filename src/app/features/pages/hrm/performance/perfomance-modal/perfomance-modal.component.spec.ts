import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfomanceModalComponent } from './perfomance-modal.component';

describe('PerfomanceModalComponent', () => {
  let component: PerfomanceModalComponent;
  let fixture: ComponentFixture<PerfomanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfomanceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfomanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
