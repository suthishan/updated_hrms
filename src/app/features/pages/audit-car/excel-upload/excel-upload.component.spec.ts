import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExcelUploadComponent } from './excel-upload.component';

describe('ExcelUploadComponent', () => {
  let component: ExcelUploadComponent;
  let fixture: ComponentFixture<ExcelUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelUploadComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(ExcelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
