import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessSettingsComponent } from './bussiness-settings.component';

describe('BussinessSettingsComponent', () => {
  let component: BussinessSettingsComponent;
  let fixture: ComponentFixture<BussinessSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BussinessSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinessSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
