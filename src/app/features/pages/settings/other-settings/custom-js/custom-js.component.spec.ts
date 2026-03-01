import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomJsComponent } from './custom-js.component';

describe('CustomJsComponent', () => {
  let component: CustomJsComponent;
  let fixture: ComponentFixture<CustomJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomJsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
