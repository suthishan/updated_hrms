import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighTaskComponent } from './high-task.component';

describe('HighTaskComponent', () => {
  let component: HighTaskComponent;
  let fixture: ComponentFixture<HighTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
