import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTabContentComponent } from './task-tab-content.component';

describe('TaskTabContentComponent', () => {
  let component: TaskTabContentComponent;
  let fixture: ComponentFixture<TaskTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskTabContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
