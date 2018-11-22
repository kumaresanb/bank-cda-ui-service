import { Component, OnInit } from "@angular/core";
import { DataService } from "../data-service";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewService } from "../services/mandate/view/view-service";
import { Mandate } from "../models/mandatemodel";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { PopupService } from "../popup.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-repair-mandate",
  templateUrl: "./repair-mandate.component.html",
  styleUrls: ["./repair-mandate.component.scss"]
})
export class RepairMandateComponent implements OnInit {
  minDate: any;
  mandateToRepair: any;
  startingDate: any;
  endingDate: any;
  endDateDisabled: any;
  disableUpto: any;
  checkBoxValue: any;
  productDetails: any;
  mndRefNum: any;
  mandateTorepair: Mandate;
  repairForm: any;
  ImageUrl: any;
  mndRef: any;
  selectedProductDetails: any;
  sponserBankName: any;
  sponsorBankErr: any;
  dataIsThere: any;
  threeBankNameDisable: any;
  sponBankName: any;
  destBankNameDetails: any;
  destBankName: any;
  destBankNameErr: any;
  utilityCodeErr: any;
  submitClicked: any;
  saveStatus: any;
  failureMsg: any;
  proxyUrl: string = environment.proxyUrl;

  selectedImage: any;
  img = new Image();
  imageExt: any;
  errorMsg: any;
  msg: any;
  msgType: any;
  successMsg: any;
  imageUpload: any;
  fromAmmend:any;
  fromCancel:any;

  account_validation_messages = {

    'payerBankCode': [
      { type: 'pattern', message: 'Please provide valid Bank Code.' },
    ],
    'startDate': [
      { type: 'required', message: 'Start Date is mandatory to be selected. Past date not allowed.' },

    ],
    'endDate': [
      { type: 'required', message: 'Please provide End Date or select Until Cancel option.' },

    ],
    'payerAccNum': [
      { type: 'pattern', message: 'Please provide valid Account Number.' },
    ],
    'amt': [
      { type: 'pattern', message: 'Please provide valid Amount.' },
    ],
    'payerEmail': [

      { type: 'pattern', message: 'Please provide valid Email Address.' },
    ],

    'payerMobileNo': [
      { type: 'pattern', message: 'Please provide valid Mobile number.' },
    ],
    'consumerRefNo': [
      { type: 'pattern', message: 'Please provide valid Loan Account number.' },
    ],
    'schemeRefNo': [
      { type: 'pattern', message: 'Please provide valid Scheme/Plan Reference.' },
     
      { type: 'maxlength', message: 'Please provide valid Scheme/Plan Reference.' }
    ],
    'payerName': [
      { type: 'pattern', message: 'Please provide valid Account Name.' },
    ],
    'payerAccNo': [
      { type: 'pattern', message: 'Please provide valid Account Number.' },
    ],
    'payerAccType': [
      { type: 'required', message: 'Account type is mandatory to be selected.' }
    ],
    'utilityCode': [
      { type: 'required', message: 'ACH code is mandatory to be selected.' }
    ]
    }

  accountType = [
    { value: "Selectaccounttype", viewValue: "Select Account Type" },
    { value: "savings", viewValue: "Savings" },
    { value: "current", viewValue: "Current" }
  ];

  amountTypes = [
    { value: "Fixed", viewValue: "Fixed" },
    { value: "Variable", viewValue: "Variable" }
  ];

  frequencies = [
    { value: "monthly", viewValue: "Monthly" },
    { value: "quarterly", viewValue: "Quarterly" },
    { value: "halfYearly", viewValue: "Half Yearly" },
    { value: "yearly", viewValue: "Yearly" },
    { value: "asAndWhenPresented", viewValue: "As and When Presented" }
  ];

  Reasons = [
    { value: "A001 - On Customer Request", viewValue: "A001 - On Customer Request" },
    { value: "M031 - Not a CBS act no.or old act no.representwithCBS no", viewValue: "M031 - Not a CBS act no.or old act no.representwithCBS no" },
   
  ];

  cancelReason = [
    { value: "C002-On Customer Request", viewValue: "C002-On Customer Request" },
    { value: "C002-On Corporate Request", viewValue: "C002-On Corporate Request" },
    { value: "C004-Account frozen", viewValue: "C004-Account frozen" },
    { value: "C002-On Corporate Request", viewValue: "C002-On Corporate Request" },
    { value: "C005-Account inoperative", viewValue: "C005-Account inoperative" },
   
  ];


  productType: any;

  constructor(
    private httpClientModule: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private viewServc: ViewService,
    private popupService: PopupService
  ) {
    this.ngOnInit();
  }

  onKeyForSponserBank(event) {
    console.log(event.target.value);

    for (var i = 0; i <= this.productDetails.data.length - 1; i++) {
      if (this.productDetails.data[i].sponserBankCode == event.target.value) {
        this.sponsorBankErr = "";
        this.dataIsThere = true;
        break;
      } else {
        this.dataIsThere = false;
      }
    }

    if (this.dataIsThere) {
      this.productType = this.productDetails.data[i].productName;
      this.repairForm.sponsorBankCode = this.productDetails.data[
        i
      ].sponserBankCode;
      this.repairForm.utilityCode = this.productDetails.data[i].achId;
      this.sponsorBankErr = "";
      this.threeBankNameDisable = false;
      this.dataService
        .getRoutingCodeDetails(this.repairForm.sponsorBankCode)
        .subscribe(
          data => {
            this.sponserBankName = data;
            this.sponBankName = this.sponserBankName.data[0].bankName;
          },
          err => {
            console.log("Error while fetching ActiveProducts", err);
          }
        );
    } else {
      this.threeBankNameDisable = true;
      this.sponsorBankErr = "Please provide valid Sponser Bank Code.";
      this.productType = "";
      this.repairForm.utilityCode = "";
      this.sponBankName = "";
    }
  }

  clear(user) {
    this.router.navigate(['mandate']);
    this.repairForm.reset();
    this.productType = "";
    this.submitClicked = "";
    this.checkBoxValue = false;
    this.disableUpto = false;
    
  }

  onKeyForUtilityCode(event) {
    console.log(event.target.value);

    for (var i = 0; i <= this.productDetails.data.length - 1; i++) {
      if (this.productDetails.data[i].achId == event.target.value) {
        this.utilityCodeErr = "";
        this.dataIsThere = true;
        break;
      } else {
        this.dataIsThere = false;
      }
    }

    if (this.dataIsThere) {
      this.productType = this.productDetails.data[i].productName;
      this.repairForm.sponsorBankCode = this.productDetails.data[
        i
      ].sponserBankCode;
      this.repairForm.utilityCode = this.productDetails.data[i].achId;
      this.utilityCodeErr = "";
      this.threeBankNameDisable = false;

      this.dataService
        .getRoutingCodeDetails(this.repairForm.sponsorBankCode)
        .subscribe(
          data => {
            this.sponserBankName = data;
            this.sponBankName = this.sponserBankName.data[0].bankName;
          },
          err => {
            console.log("Error while fetching ActiveProducts", err);
          }
        );
    } else {
      this.threeBankNameDisable = true;

      this.utilityCodeErr = "Please provide valid Sponsor Bank Code.";
      this.productType = "";
      this.repairForm.sponsorBankCode = "";
      this.sponBankName = "";
    }
  }

  startDateChanged(event) {
    console.log("start date changed====", event);
    this.endingDate = event;
  }

  endDateChanged(event) {
    console.log("end date changed====", event);
    this.startingDate = event;
    this.disableUpto = true;
  }

  untillCancelClicked(event) {
    console.log("upto selected====", event.checked);
    this.endDateDisabled = true;
    this.disableUpto = false;
    if (event.checked == false) {
      this.endDateDisabled = false;
    }
  }

  onKeyForDestBank(event) {
    console.log(event.target.value);
    this.dataService.getRoutingCodeDetails(event.target.value).subscribe(
      data => {
        this.destBankNameDetails = data;
        this.destBankName = this.destBankNameDetails.data[0].bankName;
        this.destBankNameErr = "";
        this.threeBankNameDisable = false;

        return;
      },
      err => {
        console.log("Error while fetching ActiveProducts", err);
        this.destBankName = "";
        this.threeBankNameDisable = true;

        this.destBankNameErr = "Please provide valid Deasination bank code";
      }
    );
    this.destBankNameErr = "Please provide valid Deasination bank code";
    this.destBankName = "";
    this.threeBankNameDisable = true;
  }

  ngOnInit() {
    this.mndRefNum = this.route.snapshot.paramMap.get("mndRefNum");
    this.dataService.getActiveProduct().subscribe(
      data => {
        this.productDetails = data;
      },
      err => {
        console.log("Error while fetching ActiveProducts", err);
      }
    );
    this.viewServc.getByMndRefNo(this.mndRefNum).subscribe((data: any) => {
      this.mandateTorepair = data.data;

      if(this.mandateTorepair.mndTxnCode==='SINGLE_AMEND_ACH')
      {
        this.fromAmmend=true;

      }
      if(this.mandateTorepair.mndTxnCode==='SINGLE_CANCEL_ACH')
      {
        this.fromCancel=true;

      }
     // this.productType = this.mandateTorepair.product.productName;
      this.repairForm.patchValue({
        amountType: this.mandateTorepair.amountType,
        payerAccType: this.mandateTorepair.payerAccType,
        mandateFrequency: this.mandateTorepair.mandateFrequency,
        startDate:this.mandateTorepair.startDate,
        endDate:this.mandateTorepair.endDate,
        utilityCode:this.mandateTorepair.utilityCode,
        sponsorBankCode:this.mandateTorepair.sponsorBankCode,
        payerAccNum:this.mandateTorepair.payerAccNum,
        createdDate:this.mandateTorepair.createdDate,
        payerBankCode:this.mandateTorepair.payerBankCode,
        amt:this.mandateTorepair.maxAmount,
        consumerRefNo:this.mandateTorepair.consumerRefNo,
        schemeRefNo:this.mandateTorepair.schemeRefNo,
        payerMobileNo:this.mandateTorepair.payerMobileNo,
        payerEmail:this.mandateTorepair.payerEmail,
        payerName:this.mandateTorepair.payerName,
        reason:this.mandateTorepair.reason

      });
      console.log(
        "Mandate to repair----",
        JSON.stringify(this.mandateTorepair, null, 2)
      );

      if (this.mandateTorepair.documents[0].fileString !== null) {
        this.ImageUrl =
          "data:image/jpeg;base64," +
          this.mandateTorepair.documents[0].fileString;
      } else {
        this.ImageUrl = this.mandateTorepair.documents[0].docFilePath;
      }
    });

    this.repairForm = new FormGroup({
      umrn: new FormControl(""),
      uploadedImage: new FormControl(""),
      utilityCode: new FormControl(""),
      payerAccNum: new FormControl(
        "",
        Validators.compose([
          // Validators.required,
           Validators.pattern("^[A-Za-z0-9]{5,34}$")
        ])
      ),
      payerBankCode: new FormControl(
        "",
        //Validators.compose([Validators.required])
      ),
      amt: new FormControl(
        "",
        Validators.compose([
          // Validators.required,
          // Validators.pattern("^[0-9_]{1,9}$")
        ])
      ),
      sponsorBankCode: new FormControl(),
      consumerRefNo: new FormControl(
        "",
         Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,100}$")])
      ),
      schemeRefNo: new FormControl(
        "",
        Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,100}$")])
      ),
      payerName: new FormControl(
        "",
         Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,40}$")])
      ),
      telNo: new FormControl(""),
      payerMobileNo: new FormControl(
        "",
         Validators.compose([Validators.pattern("^[0-9_]{1,34}$")])
      ),
      payerEmail: new FormControl(
        "",
        Validators.compose([
          Validators.pattern(
            "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{1,100}$"
          )
        ])
      ),
      payerAccType: new FormControl(""),
      mandateFrequency: new FormControl(""),
      createdDate: new FormControl(""),
      startDate: new FormControl("",
        //Validators.compose([Validators.required])
      ),
      endDate: new FormControl(""),
      amountType: new FormControl(""),
      reason: new FormControl(""),
      custAddId: new FormControl(""),
      frequency: new FormControl(null)
    });
  }

  onKeyForProduct(event) {
    this.dataService.getActiveProduct().subscribe(
      data => {
        this.productDetails = data;
        for (var i = 0; i < this.productDetails.data.length; i++) {
          console.log(
            "this.productDetails.data[i] ==>",
            this.productDetails.data[i]
          );
          if (this.productDetails.data[i].productName === event.value) {
            this.selectedProductDetails = this.productDetails.data[i];
            this.repairForm.patchValue({
              utilityCode: this.productDetails.data[i].achId,
              sponsorBankCode: this.productDetails.data[i].sponserBankCode
            });
            this.dataService
              .getRoutingCodeDetails(this.repairForm.value.sponsorBankCode)
              .subscribe(
                data => {
                  const spopnsBank: any = data;
                  this.sponserBankName = spopnsBank.data[0].bankName;
                },
                err => {
                  console.log("Error while fetching ActiveProducts", err);
                }
              );
          }
        }
      },
      err => {
        console.log("Error while fetching ActiveProducts", err);
      }
    );
  }

  onFileSelected(event) {
    console.log(event);
    this.selectedImage = event.target.files[0];
    this.img.src = event.target.result;
    const reader = new FileReader();
    this.imageExt = this.selectedImage.name.split(".")[1];
    this.errorMsg = "";
    if (this.imageExt === "jpg" || this.imageExt === "jpeg") {
    } else {
      this.msg =
        "Invalid Image, Only JPG and JPEG is allowed with size of max 100kb and max resolution of 500 DPI.";
      this.successMsg = "ERROR";
      this.msgType = "FAILED";
      this.img.src = "";
      this.ImageUrl = "";
      this.imageUpload = "";
      this.popupService
        .mandateSubmit(this.msg, this.successMsg, this.msgType)
        .subscribe(status => {
          console.log("successStatus=", status);
          //this.ImageUrl="";
        });
      //this.ImageUrl="";
      this.repairForm.uploadedImage.reset();
    }
    if (this.selectedImage.size > 100000) {
      this.msg =
        "Invalid Image, Only JPG and JPEG is allowed with size of max 100kb and max resolution of 500 DPI.";
      this.successMsg = "ERROR";
      this.msgType = "FAILED";

      this.imageUpload = "";
      this.popupService
        .mandateSubmit(this.msg, this.successMsg, this.msgType)
        .subscribe(status => {
          console.log("successStatus=", status);
          //this.ImageUrl="";
        });

      this.repairForm.uploadedImage.reset();
    } else {
      this.ImageUrl = "";
      this.errorMsg = "";
    }

    reader.onload = (event: any) => {
      if (this.errorMsg == "") {
        this.ImageUrl = event.target.result;
      }
      //console.log("Image Details",this.ImageUrl);
    };
    reader.readAsDataURL(this.selectedImage);
  }

  ngSubmit(user) {
    if(this.submitClicked=="clicked")
    {
      return
    }

    //this.submitClicked="clicked";

    this.submitClicked = "clicked";
    this.successMsg = "SUBMITTED";
    this.failureMsg = "FAILED";
    console.log(user);
    // user.documents = [
    //   {
    //     image: this.ImageUrl,
    //     docFileName: this.selectedImage.name,
    //     docType: this.selectedImage.type,
    //     docExtention: this.selectedImage.name.split(".")[1],
    //     fileString: this.ImageUrl.split(",")[1]
    //   }
    // ];
    //user.product = this.selectedProductDetails;
    console.log(user);
    // user.utilityCode = this.repairForm.utilityCode;
    // user.sponsorBankCode = this.repairForm.sponsorBankCode;
    // user.frequency=this.repairForm.mandateFrequency;
    // user.maxAmt=this.repairForm.amt;
    user.documents=this.mandateTorepair.documents;
    user.mndRefNo=this.mandateTorepair.mndRefNo;
  

    this.httpClientModule.post(`${this.proxyUrl}/mnd/mandate/updateMandate`, user).subscribe((data: any) => {
      console.log("Success", data);
      console.log( "data from backend ==",data);
      this.saveStatus=data.status;
      this.mndRef=data;
      if(this.saveStatus=='SUCCESS')
      {

        this.msgType="SUCCESS";
        this.msg="Mandate request with mandate reference Id "+ this.mndRef.data +" repaired successfully and moved to Pending Authorization queue.";
       this.popupService.mandateSubmit(this.msg,this.successMsg,this.msgType).subscribe((status)=>{
        console.log("successStatus=",status);
        if(status=='OK')
        {
          this.ImageUrl="";
          
         
          document.getElementById('createdDate').innerHTML="";
          this.sponBankName="";
         this.checkBoxValue=false;
         this.submitClicked="";
         this.router.navigate(['mandate']);
        // this.productDetails=[];
         
          
        }
        else{
          //this.router.navigate(['/MandateWorkbenchComponent']);
          this.router.navigate(['mandate']);
        }
       
      })
      }
    }, Error => {
      this.msgType = "FAILURE";
      this.msg = "Mandate Repair failed";
      this.popupService
        .mandateSubmit(this.msg, this.failureMsg, this.msgType)
        .subscribe(status => {
          console.log("failure Status=", status);
          this.submitClicked = "";
          // this.disableUpto=false;
        });
    }
    );
  }
}
