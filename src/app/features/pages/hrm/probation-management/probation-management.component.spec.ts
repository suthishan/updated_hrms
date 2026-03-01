import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbationManagementComponent } from './probation-management.component';

describe('ProbationManagementComponent', () => {
  let component: ProbationManagementComponent;
  let fixture: ComponentFixture<ProbationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProbationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProbationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
