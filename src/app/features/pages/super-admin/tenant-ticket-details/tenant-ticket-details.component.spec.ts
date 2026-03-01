import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantTicketDetailsComponent } from './tenant-ticket-details.component';

describe('TenantTicketDetailsComponent', () => {
  let component: TenantTicketDetailsComponent;
  let fixture: ComponentFixture<TenantTicketDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantTicketDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
