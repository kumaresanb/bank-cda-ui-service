import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEnquiryComponent } from './payment-enquiry.component';

describe('PaymentEnquiryComponent', () => {
  let component: PaymentEnquiryComponent;
  let fixture: ComponentFixture<PaymentEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
