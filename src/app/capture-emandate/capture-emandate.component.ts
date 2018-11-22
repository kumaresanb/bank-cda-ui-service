import { Component, OnInit } from "@angular/core";
import { EmandateLookUpService } from "../services/capture-emandate/emandate-lookup-service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { DataService } from "../data-service";
import { RedirectService } from "../services/redirectservice";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-capture-emandate",
  templateUrl: "./capture-emandate.component.html",
  styleUrls: ["./capture-emandate.component.scss"]
})
export class CaptureEmandateComponent implements OnInit {
  utilityCode: any = [];
  productType: any = [];
  debitType: any;
  frequency: any;
  accountType: any;
  esignRedirect = environment.proxyUrl;
  emandateForm: FormGroup;
  productDetails: any;
  proxyUrl = environment.proxyUrl;

  validation_messages = {
    utilityCode: [
      { type: "required", message: "Utility Code is mandatory to be selected." }
    ],
    sponsorBankCode: [
      {
        type: "required",
        message: "Sponsor Bank Code is mandatory."
      }
    ],
    amount: [
      {
        type: "required",
        message: "Please provide valid amount."
      },
      {
        type: "pattern",
        message: "Please provide valid amount."
      }
    ],
    referrence1: [
      {
        type: "maxlength",
        message: "Please provide valid Loan Account number"
      }
    ],
    referrence2: [
      {
        type: "maxlength",
        message: "Please provide valid Loan Account number"
      }
    ],
    startDate: [
      {
        type: "required",
        message:
          "Start date is mandatory to be selected. Past date not allowed."
      }
    ],
    productType: [
      {
        type: "required",
        message: "Product is mandatory to be selected."
      }
    ],
    debitType: [
      {
        type: "required",
        message: "Amount type is mandatory to be selected."
      }
    ],
    frequency: [
      {
        type: "required",
        message: "Frequency is mandatory to be selected."
      }
    ],
    payingbankCode: [
      {
        type: "required",
        message: "Paying Bank Code is mandatory."
      }
    ],
    accountType: [
      {
        type: "required",
        message: "Account Type is mandatory to be selected."
      }
    ],
    accountNumber: [
      {
        type: "required",
        message: "Account Number is mandatory."
      }
    ],
    accountName: [
      {
        type: "required",
        message: "Account Name is mandatory."
      }
    ],
    mobileNumber: [
      {
        type: "pattern",
        message: "Please provide valid Mobile number."
      }
    ],
    telNumber: [
      {
        type: "pattern",
        message: "Please provide valid Telephone number."
      }
    ],
    mailId: [
      {
        type: "pattern",
        message: "Please provide valid Email Address."
      }
    ]
  };

  constructor(
    private emandateLookup: EmandateLookUpService,
    private http: HttpClient,
    private dataService: DataService,
    private opentab: RedirectService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  getProductDetails() {
    this.dataService.getActiveProduct().subscribe(
      (data: any) => {
        console.log("Data of Utility Code", JSON.stringify(data, null, 2));
        this.productDetails = data.data;
        this.productDetails.forEach(element => {
          this.utilityCode.push(element.achId);
          this.productType.push(element.productName);
        });
      },
      err => {
        console.log("Error while fetching ActiveProducts", err);
      }
    );
  }

  ngOnInit() {
    this.getProductDetails();
    // this.utilityCode = this.emandateLookup.utilityCode;
    // this.productType = this.emandateLookup.productType;
    this.debitType = this.emandateLookup.debitType;
    this.frequency = this.emandateLookup.frequency;
    this.accountType = this.emandateLookup.accountType;

    this.emandateForm = new FormGroup({
      utilityCode: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      sponsorBankCode: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      amount: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9_]{1,9}$")
        ])
      ),
      referrence2: new FormControl(
        "",
        Validators.compose([Validators.maxLength(100)])
      ),
      referrence1: new FormControl(
        "",
        Validators.compose([Validators.maxLength(100)])
      ),

      startDate: new FormControl("", Validators.compose([Validators.required])),
      productType: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      debitType: new FormControl("", Validators.compose([Validators.required])),
      frequency: new FormControl("", Validators.compose([Validators.required])),
      enddate: new FormControl(),

      payingbankCode: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      accountType: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      accountNumber: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      accountName: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      mobileNumber: new FormControl(""),
      telNumber: new FormControl(""),
      mailId: new FormControl(
        "",
        Validators.compose([
          Validators.pattern(
            "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{1,100}$"
          )
        ])
      )
    });
  }

  proceed() {
    let request = new RequestObject();
    request.utilityCode = this.emandateForm.value.utilityCode;
    request.emailId = this.emandateForm.value.mailId;
    request.frequency = this.emandateForm.value.frequency;

    request.payerName = this.emandateForm.value.accountName;
    request.mndAction = "create";
    request.sponserBankCode = this.emandateForm.value.sponsorBankCode;
    request.colltnAmt = this.emandateForm.value.amount;
    request.loanRefNum = this.emandateForm.value.referrence1;
    request.schemePlanRefNum = this.emandateForm.value.referrence2;
    request.legalAccountNumber = this.emandateForm.value.accountNumber;
    request.amountType = this.emandateForm.value.debitType;
    request.corporateBank = "IndusInd Bank";
    request.customerAccType = this.emandateForm.value.accountType;
    request.destbankCode = this.emandateForm.value.payingbankCode;
    request.finalclctdt = this.datePipe.transform(
      this.emandateForm.value.enddate,
      "yyyy-MM-dd hh:mm:ss"
    );
    request.amountType = this.emandateForm.value.debitType;
    request.firstclctdt = this.datePipe.transform(
      this.emandateForm.value.startDate,
      "yyyy-MM-dd hh:mm:ss"
    );
    request.mandateCategoryCode = "U001";
    request.mobile = this.emandateForm.value.mobileNumber;
    request.transactionCode = "";
    request.aadharNumber = "";

    this.http
      .post(`${this.proxyUrl}/mnd/esign/process`, request)
      .subscribe((data: any) => {
        this.opentab.post("", data.data);
        this.router.navigate(["homepage"]);
      });
  }
}

class RequestObject {
  mndAction;
  colltnAmt;
  maxAmt;
  utilityCode;
  transactionCode;
  mandateCategoryCode;
  frequency;
  loanRefNum;
  schemePlanRefNum;
  firstclctdt;
  finalclctdt;
  amountType;
  aadharNumber;
  payerName;
  mobile;
  emailId;
  customerAccType;
  destbankCode;
  sponserBankCode;
  legalAccountNumber;
  corporateBank;
  corporateId;
}
