import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileEnquiryComponent } from '../file-enquiry/file-enquiry.component';
import { MatTabChangeEvent } from '@angular/material';
import { MandateEnquiryComponent } from '../mandate-enquiry/mandate-enquiry.component';
import { PaymentEnquiryComponent } from '../payment-enquiry/payment-enquiry.component';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {

  @ViewChild(FileEnquiryComponent) private fileEnquiryComponent: FileEnquiryComponent;
  @ViewChild(MandateEnquiryComponent) private mandateEnquiryComponent: MandateEnquiryComponent;
  @ViewChild(PaymentEnquiryComponent) private paymentEnquiryComponent: PaymentEnquiryComponent;
  constructor() { }

  selected:any = 0;

  private fileEnquiryComponentData: any;

  onTabChanged(event: MatTabChangeEvent) {
  this.fileEnquiryComponent.reset();
  this.mandateEnquiryComponent.reset("external");
  this.paymentEnquiryComponent.reset();
}

  ngOnInit() {

    var siVal = sessionStorage.getItem("si");
    if(siVal){
      this.selected = siVal;
      sessionStorage.clear();
    }
  }

}
