import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationSettingsComponent } from './authentication-settings.component';

describe('AuthenticationSettingsComponent', () => {
  let component: AuthenticationSettingsComponent;
  let fixture: ComponentFixture<AuthenticationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
