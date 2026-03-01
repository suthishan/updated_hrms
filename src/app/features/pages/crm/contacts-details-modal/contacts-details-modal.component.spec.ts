import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsDetailsModalComponent } from './contacts-details-modal.component';

describe('ContactsDetailsModalComponent', () => {
  let component: ContactsDetailsModalComponent;
  let fixture: ComponentFixture<ContactsDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
