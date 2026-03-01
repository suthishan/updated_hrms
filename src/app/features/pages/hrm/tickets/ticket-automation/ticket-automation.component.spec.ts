import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAutomationComponent } from './ticket-automation.component';

describe('TicketAutomationComponent', () => {
  let component: TicketAutomationComponent;
  let fixture: ComponentFixture<TicketAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketAutomationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
