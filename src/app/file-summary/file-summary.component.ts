import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTabChangeEvent } from '@angular/material';
import { MandateUploadedGridComponent } from '../mandate-uploaded-grid/mandate-uploaded-grid.component';
import { PaymentUploadedGridComponent } from '../payment-uploaded-grid/payment-uploaded-grid.component';

@Component({
  selector: "app-file-summary",
  templateUrl: "./file-summary.component.html",
  styleUrls: ["./file-summary.component.scss"]
})
export class FileSummaryComponent implements OnInit {
  // onTabChanged: any;
  selected:any = 0;
  @ViewChild(MandateUploadedGridComponent) private mandateUploadedGridComponent: MandateUploadedGridComponent;
  @ViewChild(PaymentUploadedGridComponent) private paymentUploadedGridComponent: PaymentUploadedGridComponent;


  constructor(private router: Router) { }
  ngOnInit() {

    var siVal = sessionStorage.getItem("summaryIndex");
    if (siVal) {
      this.selected = siVal;
      sessionStorage.clear();
    }
  }

  onTabChanged(event: MatTabChangeEvent) {

    if(event.tab.textLabel==='Mandate Summary')
    {
      this.mandateUploadedGridComponent.ngOnInit();
    }
    else{
      this.paymentUploadedGridComponent.ngOnInit();
    }
    
    
    

  }
}
