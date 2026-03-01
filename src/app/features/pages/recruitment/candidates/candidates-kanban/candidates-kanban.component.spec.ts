import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesKanbanComponent } from './candidates-kanban.component';

describe('CandidatesKanbanComponent', () => {
  let component: CandidatesKanbanComponent;
  let fixture: ComponentFixture<CandidatesKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatesKanbanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
