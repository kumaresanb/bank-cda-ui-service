import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { PaymentFileSummaryService } from "../services/payment/paymentfilesummaryserivce";
import { PopupService } from "../popup.service";
import { AuthenticationService } from "../services/authentication/login/login.service";
import { ViewService } from "../services/mandate/view/view-service";
@Component({
  selector: "app-view-transaction",
  templateUrl: "./view-transaction.component.html",
  styleUrls: ["./view-transaction.component.scss"]
})
export class ViewTransactionComponent implements OnInit {
  routedObject: any;
  rejectReason: any;
  rjctError: any;
  count: any;
  userRole: any;
  reasonArr: any = [];
  onUsreason: any;
  drpDownReason: any;
  accountVerifyResponse: any;
  reasonDescription:any={
    rsnDesc:''
  };

  constructor(private router: Router, private route: ActivatedRoute,
    private paymentFileSummaryService: PaymentFileSummaryService,
    private popupService: PopupService,
    private viewService: ViewService,
    private authService: AuthenticationService) {
    this.route.params.subscribe((data: any) => {
      this.routedObject = JSON.parse(data.data);
      // console.log("Response---", JSON.stringify(this.routedObject, null, 2));
      this.count = data.count;
    });
  }

  ngOnInit() {
    this.userRole = this.authService.loggedInUser.role.roleType;
    this.route.params.subscribe((data: any) => {
      this.routedObject = JSON.parse(data.data);
      this.paymentFileSummaryService.reasonDesc(this.routedObject.reasonCode).subscribe((reasonObject:any)=>{
        if(this.reasonDescription!=null){
          this.reasonDescription=reasonObject.data;
        }else{
          this.reasonDescription.rsnDesc="";
        }
      },
    err=>{
      this.reasonDescription.rsnDesc="";
    });

      this.paymentFileSummaryService.rejectReasonList().subscribe((data: any) => {
        this.reasonArr = data.data;
      });
    });
  }

  navigateBack() {
    this.router.navigate(['paymentuploadgrid']);
  }


  accountInquiry(accountNumber) {
    this.viewService.accountInquiryService(accountNumber).subscribe((cbsResp: any) => {
      this.accountVerifyResponse = cbsResp.data;
    })
  }

  removeReject() {
    if (
      !this.rejectReason ||
      this.rejectReason == undefined ||
      this.rejectReason == ""
    ) {
      this.rjctError = true;
    }
    else {
      this.paymentFileSummaryService.rejectSingleRecord(this.routedObject.orgTxnRef, this.rejectReason).subscribe((data: any) => {
        let msg = `Transaction with reference number ${this.routedObject.orgTxnRef}`

        this.popupService.mandateSubmit(msg, "REMOVED", "SUCCESS").subscribe((status) => {
          this.router.navigate(['paymentTransaction', { fileName: this.routedObject.orgFilename, count: (this.count - 1) }]);
        })
      });
    }
  }

  rejectOnUs() {
    if (!this.rejectReason ||
      this.rejectReason == undefined ||
      this.rejectReason == "") {
      this.rjctError = true;
    }
    else{
      this.paymentFileSummaryService.rejectSingleRecordOnUs(this.routedObject.orgTxnRef, this.rejectReason, this.routedObject.reasonCode).subscribe((data: any) => {
        let msg = `Transaction with reference number ${this.routedObject.orgTxnRef}`
  
        this.popupService.mandateSubmit(msg, "REJECTED", "SUCCESS").subscribe((status) => {
          this.router.navigate(['paymentTransaction', { fileName: this.routedObject.orgFilename, count: (this.count - 1) }]);
        })
      });
    }
  }



  acceptOnUs() {
  if (!this.rejectReason ||
      this.rejectReason == undefined ||
      this.rejectReason == "") {
      this.rjctError = true;
    }
    else{
      this.paymentFileSummaryService.acceptSingleRecordOnUs(this.routedObject.orgTxnRef,this.rejectReason,this.routedObject.reasonCode).subscribe((data: any) => {
        let msg = `Transaction with reference number ${this.routedObject.orgTxnRef}`
  
        this.popupService.mandateSubmit(msg, "ACCEPTED", "SUCCESS").subscribe((status) => {
          this.router.navigate(['paymentTransaction', { fileName: this.routedObject.orgFilename, count: (this.count - 1) }]);
        })
      });
    }
    
  }


  submitOnUs() {
    if (
      (!this.onUsreason ||
        this.onUsreason == undefined ||
        this.onUsreason == "")
    ) {
      this.drpDownReason = true;
    }
    else if (!this.rejectReason ||
      this.rejectReason == undefined ||
      this.rejectReason == "") {
      this.rjctError = true;
    }
    else {
      this.paymentFileSummaryService.submitSingleRecordOnUs(this.routedObject.orgTxnRef, this.rejectReason,this.onUsreason).subscribe((data: any) => {
        let msg = `Transaction with reference number ${this.routedObject.orgTxnRef}`

        this.popupService.mandateSubmit(msg, "SUBMITTED", "SUCCESS").subscribe((status) => {
          this.router.navigate(['paymentTransaction', { fileName: this.routedObject.orgFilename, count: (this.count - 1) }]);
        })
      });
    }
  }
}
