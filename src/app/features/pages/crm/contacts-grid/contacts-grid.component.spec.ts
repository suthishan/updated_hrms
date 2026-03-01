import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsGridComponent } from './contacts-grid.component';

describe('ContactsGridComponent', () => {
  let component: ContactsGridComponent;
  let fixture: ComponentFixture<ContactsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
