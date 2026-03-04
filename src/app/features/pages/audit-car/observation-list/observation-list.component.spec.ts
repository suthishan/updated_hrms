import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ObservationListComponent } from './observation-list.component';

describe('ObservationListComponent', () => {
  let component: ObservationListComponent;
  let fixture: ComponentFixture<ObservationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationListComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(ObservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
