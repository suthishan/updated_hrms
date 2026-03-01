import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgebaseDetailsComponent } from './knowledgebase-details.component';

describe('KnowledgebaseDetailsComponent', () => {
  let component: KnowledgebaseDetailsComponent;
  let fixture: ComponentFixture<KnowledgebaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnowledgebaseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnowledgebaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
