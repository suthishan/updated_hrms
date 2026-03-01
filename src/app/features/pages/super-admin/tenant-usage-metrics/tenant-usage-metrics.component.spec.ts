import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantUsageMetricsComponent } from './tenant-usage-metrics.component';

describe('TenantUsageMetricsComponent', () => {
  let component: TenantUsageMetricsComponent;
  let fixture: ComponentFixture<TenantUsageMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantUsageMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantUsageMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
