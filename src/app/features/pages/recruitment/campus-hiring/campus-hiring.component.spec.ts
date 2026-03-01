import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusHiringComponent } from './campus-hiring.component';

describe('CampusHiringComponent', () => {
  let component: CampusHiringComponent;
  let fixture: ComponentFixture<CampusHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusHiringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
