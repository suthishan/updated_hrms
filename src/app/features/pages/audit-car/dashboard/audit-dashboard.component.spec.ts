import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuditDashboardComponent } from './audit-dashboard.component';

describe('AuditDashboardComponent', () => {
  let component: AuditDashboardComponent;
  let fixture: ComponentFixture<AuditDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditDashboardComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AuditDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
