import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumTaskComponent } from './medium-task.component';

describe('MediumTaskComponent', () => {
  let component: MediumTaskComponent;
  let fixture: ComponentFixture<MediumTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediumTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
