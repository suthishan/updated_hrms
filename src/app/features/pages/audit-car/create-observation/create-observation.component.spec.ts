import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateObservationComponent } from './create-observation.component';

describe('CreateObservationComponent', () => {
  let component: CreateObservationComponent;
  let fixture: ComponentFixture<CreateObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateObservationComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
