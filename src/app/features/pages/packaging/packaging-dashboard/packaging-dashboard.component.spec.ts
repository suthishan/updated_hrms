import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PackagingDashboardComponent } from './packaging-dashboard.component';

describe('PackagingDashboardComponent', () => {
  let component: PackagingDashboardComponent;
  let fixture: ComponentFixture<PackagingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagingDashboardComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(PackagingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should have breadcrumb items', () => expect(component.breadCrumbItems.length).toBeGreaterThan(0));
});
