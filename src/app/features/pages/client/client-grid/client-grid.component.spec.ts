import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGridComponent } from './client-grid.component';

describe('ClientGridComponent', () => {
  let component: ClientGridComponent;
  let fixture: ComponentFixture<ClientGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
