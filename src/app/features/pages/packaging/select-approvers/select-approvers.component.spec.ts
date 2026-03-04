import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SelectApproversComponent } from './select-approvers.component';

describe('SelectApproversComponent', () => {
  let component: SelectApproversComponent;
  let fixture: ComponentFixture<SelectApproversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectApproversComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(SelectApproversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should initialize with one step', () => expect(component.workflowSteps.length).toBe(1));
});
