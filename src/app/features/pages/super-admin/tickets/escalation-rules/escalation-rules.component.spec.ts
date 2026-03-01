import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationRulesComponent } from './escalation-rules.component';

describe('EscalationRulesComponent', () => {
  let component: EscalationRulesComponent;
  let fixture: ComponentFixture<EscalationRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalationRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscalationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
