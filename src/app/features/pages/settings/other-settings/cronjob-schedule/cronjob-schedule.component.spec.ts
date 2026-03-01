import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronjobScheduleComponent } from './cronjob-schedule.component';

describe('CronjobScheduleComponent', () => {
  let component: CronjobScheduleComponent;
  let fixture: ComponentFixture<CronjobScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronjobScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronjobScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
