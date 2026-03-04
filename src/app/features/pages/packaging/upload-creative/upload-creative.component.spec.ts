import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UploadCreativeComponent } from './upload-creative.component';

describe('UploadCreativeComponent', () => {
  let component: UploadCreativeComponent;
  let fixture: ComponentFixture<UploadCreativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCreativeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
    fixture = TestBed.createComponent(UploadCreativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('should reject non-PDF/JPEG files', () => {
    const mockFile = new File(['test'], 'test.docx', { type: 'application/msword' });
    component.processFiles([mockFile]);
    expect(component.validationError).toContain('not allowed');
  });
});
