import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsGridComponent } from './jobs-grid.component';

describe('JobsGridComponent', () => {
  let component: JobsGridComponent;
  let fixture: ComponentFixture<JobsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
