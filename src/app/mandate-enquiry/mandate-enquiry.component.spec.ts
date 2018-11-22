import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateEnquiryComponent } from './mandate-enquiry.component';

describe('MandateEnquiryComponent', () => {
  let component: MandateEnquiryComponent;
  let fixture: ComponentFixture<MandateEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandateEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandateEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
