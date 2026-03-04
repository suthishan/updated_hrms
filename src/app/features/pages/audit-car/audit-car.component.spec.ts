import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuditCarComponent } from './audit-car.component';

describe('AuditCarComponent', () => {
  let component: AuditCarComponent;
  let fixture: ComponentFixture<AuditCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditCarComponent, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AuditCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
