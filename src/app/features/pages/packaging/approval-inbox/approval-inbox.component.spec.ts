import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ApprovalInboxComponent } from './approval-inbox.component';

describe('ApprovalInboxComponent', () => {
  let component: ApprovalInboxComponent;
  let fixture: ComponentFixture<ApprovalInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalInboxComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(ApprovalInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
