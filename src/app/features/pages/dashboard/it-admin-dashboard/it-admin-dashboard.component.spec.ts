import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItAdminDashboardComponent } from './it-admin-dashboard.component';

describe('ItAdminDashboardComponent', () => {
  let component: ItAdminDashboardComponent;
  let fixture: ComponentFixture<ItAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItAdminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
