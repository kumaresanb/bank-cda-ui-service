import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { MandateReportComponent } from '../mandate-report/mandate-report.component';
import { PaymentReportComponent } from '../payment-report/payment-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild(MandateReportComponent) private mandateReportComponent:MandateReportComponent;
  @ViewChild(PaymentReportComponent) private paymentReportComponent:PaymentReportComponent;


  constructor() { }
  selected:any = 0;

  ngOnInit() {
    var siVal = sessionStorage.getItem("si");
    if(siVal){
      this.selected = siVal;
      sessionStorage.clear();
    }
  }
  onTabChanged(event: MatTabChangeEvent)
  {
    this.mandateReportComponent.reset("tabChange");
    this.paymentReportComponent.reset();
  }

}
