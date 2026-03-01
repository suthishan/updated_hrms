import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetModalComponent } from './asset-modal.component';

describe('AssetModalComponent', () => {
  let component: AssetModalComponent;
  let fixture: ComponentFixture<AssetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssetModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
