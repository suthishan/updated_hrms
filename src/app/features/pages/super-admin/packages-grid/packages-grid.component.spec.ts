import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesGridComponent } from './packages-grid.component';

describe('PackagesGridComponent', () => {
  let component: PackagesGridComponent;
  let fixture: ComponentFixture<PackagesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackagesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
