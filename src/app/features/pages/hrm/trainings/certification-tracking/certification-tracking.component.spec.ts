import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationTrackingComponent } from './certification-tracking.component';

describe('CertificationTrackingComponent', () => {
  let component: CertificationTrackingComponent;
  let fixture: ComponentFixture<CertificationTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
