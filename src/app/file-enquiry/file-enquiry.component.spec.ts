import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileEnquiryComponent } from './file-enquiry.component';

describe('FileEnquiryComponent', () => {
  let component: FileEnquiryComponent;
  let fixture: ComponentFixture<FileEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
