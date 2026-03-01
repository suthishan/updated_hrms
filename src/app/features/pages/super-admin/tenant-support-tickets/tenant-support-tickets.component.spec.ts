import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSupportTicketsComponent } from './tenant-support-tickets.component';

describe('TenantSupportTicketsComponent', () => {
  let component: TenantSupportTicketsComponent;
  let fixture: ComponentFixture<TenantSupportTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantSupportTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantSupportTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
