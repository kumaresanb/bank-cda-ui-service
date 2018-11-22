import { Component, OnInit } from "@angular/core";
import { ViewService } from "../services/mandate/view/view-service";
import { AuthenticationService } from "../services/authentication/login/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfigService } from "../services/config/config-service";
import { PopupService } from "../popup.service";
import { MatDialog } from "@angular/material";
import { FormControl, FormGroup } from "@angular/forms";
import { DataService } from "../data-service";

@Component({
  selector: "app-view-mandate",
  templateUrl: "./view-mandate.component.html",
  styleUrls: ["./view-mandate.component.scss"]
})
export class ViewMandateComponent implements OnInit {
  mandate: any;
  mndRefNum: string;
  showAuthAction: boolean;
  showRepairDeleteAction: boolean;
  showTextArea = false;
  dateFormat: any;
  textAreaMessage: any;
  imageUrl: string;
  message: string;
  messageType: string;
  successMessage: string;
  errorMessage: string;
  authComment: string;
  myform: any;
  sponserBankData: any;
  sponserBankName: any;
  sponserBankBranchName: any;
  payerBankData: any;
  payerBankName: any;
  payerBankBranchName: any;
  userRole: any;

  accountVerifyResponse:any;


  constructor(
    private viewService: ViewService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private popupService: PopupService,
    public dialog: MatDialog,
    private dataService: DataService,
    private authService: AuthenticationService
  ) {
    this.dateFormat = this.configService.getDateFormat();
    this.authComment = "";
    this.ngOnInit();
  }

  ngOnInit() {
    this.userRole = this.authService.loggedInUser.role.roleType;
    this.myformData();
    this.mndRefNum = this.route.snapshot.paramMap.get("mndRefNum");
    this.viewService.getByMndRefNo(this.mndRefNum).subscribe((resp: any) => {
      this.mandate = resp.data;
      console.log("Mandate Object----", JSON.stringify(this.mandate, null, 2));
      this.dataService
        .getRoutingCodeDetails(this.mandate.sponsorBankCode)
        .subscribe(
          data => {
            this.sponserBankData = data;

            // this.sponserBankName = this.sponserBankData.data[0].bankName;
            // this.sponserBankBranchName = this.sponserBankData.data[0].branchName;
          },
          err => {
            console.log("Error while fetching Sponsor Code Details", err);
          }
        );
      this.dataService
        .getRoutingCodeDetails(this.mandate.payerBankCode)
        .subscribe(
          data => {
            this.payerBankData = data;

            // this.payerBankName = this.payerBankData.data[0].bankName;
            // this.payerBankBranchName = this.payerBankData.data[0].branchName;
          },
          err => {
            console.log("Error while fetching Sponsor Code Details", err);
          }
        );

      if (this.mandate.queueStatus === "PSA-300") {
        this.textAreaMessage = "Comment";
        this.showAuthAction = true;
        this.showTextArea = true;
      } else if (this.mandate.queueStatus === "REJ-300") {
        this.showRepairDeleteAction = true;
      } else {
        this.showAuthAction = false;
        this.showTextArea = false;
        this.showRepairDeleteAction = false;
      }
      if (this.mandate.documents[0].fileString !== null) {
        this.imageUrl =
          "data:image/jpeg;base64," + this.mandate.documents[0].fileString;
      } else {
        this.imageUrl = this.mandate.documents[0].docFilePath;
      }

      console.log("response from  getByMndRefNo()", this.mandate);
    });
  }

  processMandate(mandate, newMandate) {
    const action = "ACC";
    mandate.authComment = newMandate.authComment;
    this.viewService.processMandate(mandate, action).subscribe((resp: any) => {
      this.message =
        "Mandate request with mandate reference id " +
        mandate.mndRefNo +
        " Authorized successfully and moved to Pending Send.";
      this.messageType = "SUCCESS";
      this.successMessage = "SUCCESS";
      this.popupService
        .mandateSubmit(this.message, this.successMessage, this.messageType)
        .subscribe(status => {
          console.log("successStatus=", status);
          this.router.navigate(["mandate"]);
        });
    });
  }
  processMandateReject(mandate, newMandate) {
    mandate.authComment = newMandate.authComment;
    if (
      mandate.authComment == null ||
      mandate.authComment == undefined ||
      mandate.authComment == ""
    ) {
      this.message =
        "Please provide valid reasons/Remarks for mandate rejection";
      this.messageType = "ERROR";
      this.successMessage = "FAILED";
      this.popupService
        .mandateSubmit(this.message, this.successMessage, this.messageType)
        .subscribe(status => {
        });
    } else {
      this.viewService.processMandateReject(mandate).subscribe((resp: any) => {
        this.message =
          "Mandate request with mandate reference id " +
          mandate.mndRefNo +
          " Rejected successfully and moved to Rejected by Authorizer queue.";
        this.messageType = "SUCCESS";
        this.successMessage = "SUCCESS";
        this.popupService
          .mandateSubmit(this.message, this.successMessage, this.messageType)
          .subscribe(status => {
            this.router.navigate(["mandate"]);
          });
      });
    }
  }

  // repairMandate(mandate) {
  //   this.router.navigate(["reapairmandate", { mndRefNum: mandate.mndRefNo }]);
  // }

  repairMandate(mandate) {
    const action = 'SEND_TO_REPAIR';
    this.viewService.processMandate(mandate, action).subscribe((resp: any) => {
      console.log(JSON.stringify(resp));
      this.message =
        "Mandate request with mandate reference id " +
        mandate.mndRefNo +
        "is successfully moved to Manual Intervention queue.";
      this.messageType = "SUCCESS";
      this.successMessage = "SUCCESS";
      this.popupService
        .mandateSubmit(this.message, this.successMessage, this.messageType)
        .subscribe(status => {
          console.log("successStatus=", status);
          this.router.navigate(["mandate"]);
        });
    });

  }
  deleteMandate(mandate) {
    const action = "DEL";
    this.message =
      "You will not be able to recover mandate (Reference number " +
      mandate.mndRefNo +
      " )";
    this.messageType = "WARNING";
    this.successMessage = "Are you sure ?";
    this.popupService
      .mandateView(this.message, this.successMessage, this.messageType)
      .subscribe(status => {
        console.log("Status ", status);

        if (status === "OK") {
          this.viewService
            .processMandate(mandate, action)
            .subscribe((resp: any) => {
              console.log(JSON.stringify(resp));
              this.message =
                "Mandate request with mandate reference id " +
                mandate.mndRefNo +
                " Deleted successfully and moved to Deleted queue.";
              this.messageType = "SUCCESS";
              this.successMessage = "SUCCESS";
              this.popupService
                .mandateSubmit(
                  this.message,
                  this.successMessage,
                  this.messageType
                )
                .subscribe(status => {
                  console.log("successStatus=", status);
                  this.router.navigate(["mandate"]);
                });
            });
        }
      });
  }
  myformData() {
    this.myform = new FormGroup({
      authComment: new FormControl("")
    });
  }

  accountInquiry(custAccNumber) {
    this.viewService.accountInquiryService(custAccNumber).subscribe((data:any) => {
      this.accountVerifyResponse=data.data;
    })
  }

  close() {
    this.router.navigate(["mandate"]);
  }
}
