import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsGridComponent } from './deals-grid.component';

describe('DealsGridComponent', () => {
  let component: DealsGridComponent;
  let fixture: ComponentFixture<DealsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
