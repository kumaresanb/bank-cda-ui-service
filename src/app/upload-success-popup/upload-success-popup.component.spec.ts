import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSuccessPopupComponent } from './upload-success-popup.component';

describe('UploadSuccessPopupComponent', () => {
  let component: UploadSuccessPopupComponent;
  let fixture: ComponentFixture<UploadSuccessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSuccessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
