import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesGridComponent } from './candidates-grid.component';

describe('CandidatesGridComponent', () => {
  let component: CandidatesGridComponent;
  let fixture: ComponentFixture<CandidatesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
