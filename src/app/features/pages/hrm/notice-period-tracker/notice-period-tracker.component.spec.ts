import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePeriodTrackerComponent } from './notice-period-tracker.component';

describe('NoticePeriodTrackerComponent', () => {
  let component: NoticePeriodTrackerComponent;
  let fixture: ComponentFixture<NoticePeriodTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePeriodTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePeriodTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
