import { Component, OnInit } from "@angular/core";
import { DataService } from "../data-service";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewService } from "../services/mandate/view/view-service";
import { Mandate } from "../models/mandatemodel";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { PopupService } from "../popup.service";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "../services/authentication/login/login.service";

@Component({
  selector: "app-ammend-mandate",
  templateUrl: "./ammend-mandate.component.html",
  styleUrls: ["./ammend-mandate.component.scss"]
})
export class AmmendMandateComponent implements OnInit {
  minDate: any;
  startingDate: any;
  endingDate: any;
  endDateDisabled: any;
  disableUpto: boolean=false;
  checkBoxValue: boolean=false;
  productDetails: any;
  mndRefNum: any;
  mandateToAmend: Mandate;
  amendForm: any;
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
  docDetails:any;

  selectedImage: any;
  img = new Image();
  imageExt: any;
  errorMsg: any;
  msg: any;
  msgType: any;
  successMsg: any;
  imageUpload: any;
  userRole:any;
  reason:any;


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
      { type: 'pattern', message: 'Please provide valid Utility code' }
    ],
    'sponsorBankCode': [
      { type: 'pattern', message: 'Please provide valid Sponsor bank code.' }
    ]
    }

  accountType = [
   // { value: "Selectaccounttype", viewValue: "Select Account Type" },
    { value: "SAVINGS", viewValue: "Savings" },
    { value: "CURRENT", viewValue: "Current" }
  ];

  amountTypes = [
    { value: "F", viewValue: "Fixed" },
    { value: "V", viewValue: "Variable" }
  ];

  frequencies = [
    { value: 'MNTH', viewValue: 'Monthly' },
    { value: 'QURT', viewValue: 'Quarterly' },
    { value: 'MIAN', viewValue: 'Half Yearly' },
    { value: 'YEAR', viewValue: 'Yearly' },
    { value: 'ADHO', viewValue: 'As and When Presented' }
  ];

  Reason = [
    { value: "A001 - On Customer Request", viewValue: "A001 - On Customer Request" },
    { value: "M031 - Not a CBS act no", viewValue: "M031 - Not a CBS act no." },
   
  ];


  

  

  productType: any;

  constructor(
    private httpClientModule: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private viewServc: ViewService,
    private popupService: PopupService,
    private authService:AuthenticationService
  ) {
   // this.ngOnInit();
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
      this.amendForm.sponsorBankCode = this.productDetails.data[
        i
      ].sponserBankCode;
      this.amendForm.utilityCode = this.productDetails.data[i].achId;
      this.sponsorBankErr = "";
      this.threeBankNameDisable = false;
      this.dataService
        .getRoutingCodeDetails(this.amendForm.sponsorBankCode)
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
      this.amendForm.utilityCode = "";
      this.sponBankName = "";
    }
  }

  clear(user) {
    this.router.navigate(['mandate']);
    this.amendForm.reset();
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
      this.amendForm.sponsorBankCode = this.productDetails.data[
        i
      ].sponserBankCode;
      this.amendForm.utilityCode = this.productDetails.data[i].achId;
      this.utilityCodeErr = "";
      this.threeBankNameDisable = false;

      this.dataService
        .getRoutingCodeDetails(this.amendForm.sponsorBankCode)
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
      this.amendForm.sponsorBankCode = "";
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
    // this.dataService.getActiveProduct().subscribe(
    //   data => {
    //     this.productDetails = data;
    //   },
    //   err => {
    //     console.log("Error while fetching ActiveProducts", err);
    //   }
    // );




    this.viewServc.getActiveMandateByMndRefNo(this.mndRefNum).subscribe((data: any) => {
      this.mandateToAmend = data.data;
     // this.productType = this.mandateToAmend.product.productName;
    

      this.amendForm.patchValue({
        umrn:this.mandateToAmend.umrn,
        amountType: this.mandateToAmend.amountType,
        payerAccType: this.mandateToAmend.payerAccType,
        mandateFrequency: this.mandateToAmend.mandateFrequency,
        startDate:this.mandateToAmend.startDate,
        endDate:this.mandateToAmend.endDate,
        utilityCode:this.mandateToAmend.utilityCode,
        sponsorBankCode:this.mandateToAmend.sponsorBankCode,
        payerAccNum:this.mandateToAmend.payerAccNum,
        createdDate:this.mandateToAmend.createdDate,
        payerBankCode:this.mandateToAmend.payerBankCode,
        amt:this.mandateToAmend.maxAmount,
        consumerRefNo:this.mandateToAmend.consumerRefNo,
        schemeRefNo:this.mandateToAmend.schemeRefNo,
        payerMobileNo:this.mandateToAmend.payerMobileNo,
        payerEmail:this.mandateToAmend.payerEmail,
        payerName:this.mandateToAmend.payerName

      });
      console.log(
        "Mandate to repair----",
        JSON.stringify(this.mandateToAmend, null, 2)
      );


      if (this.mandateToAmend.documents[0].fileString !== null) {
        this.ImageUrl =
          "data:image/jpeg;base64," +
          this.mandateToAmend.documents[0].fileString;
      } else {
        this.ImageUrl = this.mandateToAmend.documents[0].docFilePath;
      }
    });

   
      

    this.amendForm = new FormGroup({
      umrn: new FormControl(""),
      uploadedImage: new FormControl(""),
      utilityCode: new FormControl("",
      // Validators.compose([
      //    Validators.required,
        //  Validators.pattern("^[A-Za-z0-9]{5,34}$")
      // ])
    ),
      payerAccNum: new FormControl(
        "",
        Validators.compose([
          // Validators.required
           Validators.pattern("^[A-Za-z0-9]{5,34}$")
        ])
      ),
      payerBankCode: new FormControl(
        "",
        Validators.compose([
          //Validators.required
        ])
      ),
      amt: new FormControl(
        "",
        Validators.compose([
          // Validators.required
          // Validators.pattern("(0\.((0[1-9]{1})|([1-9]{1}([0-9]{1})?)))|(([1-9]+[0-9]*)(\.([0-9]{1,2}))?)")
        ])
      ),
      sponsorBankCode: new FormControl( ""
      ,
      Validators.compose([
      //    Validators.required,
          Validators.pattern("^[A-Za-z0-9]{5,34}$")
      ])
    ),
      consumerRefNo: new FormControl(
        "",
         //Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,100}$")])
      ),
      schemeRefNo: new FormControl(
        "",
        //Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,100}$")])
      ),
      payerName: new FormControl(
        "",
         Validators.compose([
         // Validators.required
          //Validators.pattern("^[A-Za-z0-9]{1,40}$")
         ])),
      telNo: new FormControl(""),
      payerMobileNo: new FormControl(
        "",
          Validators.compose([
        //   Validators.required, 
         //  Validators.pattern("^[0-9_]{1,34}$")
        ])
      ),
      payerEmail: new FormControl(
        "",
         Validators.compose([
           Validators.pattern(
             "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{1,100}$"
           )
         ])
      ),
      payerAccType: new FormControl("",
      Validators.compose([
       // Validators.required
     ])),
      mandateFrequency: new FormControl("",
      Validators.compose([
       // Validators.required
     ])
    ),
      createdDate: new FormControl(""),
      startDate: new FormControl("",
      Validators.compose([
       // Validators.required
     ])),
      endDate: new FormControl(""),
      amountType: new FormControl("",
      Validators.compose([
       // Validators.required
     ])),
      reason: new FormControl("",
      Validators.compose([
        //Validators.required
     ])),
      custAddId: new FormControl(""),
      frequency: new FormControl("",
      Validators.compose([
       // Validators.required
     ]))
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
            this.amendForm.patchValue({
              utilityCode: this.productDetails.data[i].achId,
              sponsorBankCode: this.productDetails.data[i].sponserBankCode
            });
            this.dataService
              .getRoutingCodeDetails(this.amendForm.value.sponsorBankCode)
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
      this.amendForm.uploadedImage.reset();
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

      this.amendForm.uploadedImage.reset();
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
   
    this.userRole=this.authService.loggedInUser.role.roleType;
    this.submitClicked = "clicked";
    this.successMsg = "SUBMITTED";
    this.failureMsg = "FAILED";
    console.log(this.imageExt);

    if(this.selectedImage!=undefined)
    {
      user.documents = [
        {
          image: this.ImageUrl,
          docFileName: this.selectedImage.name,
          docType: this.selectedImage.type,
          docExtention: this.selectedImage.name.split(".")[1],
          fileString: this.ImageUrl.split(",")[1]
        }
      ];

    }
  
    //user.product = this.selectedProductDetails;
    console.log(user);
    // user.utilityCode = this.amendForm.utilityCode;
    // user.sponsorBankCode = this.amendForm.sponsorBankCode;
    // user.frequency=this.amendForm.mandateFrequency;
    // user.maxAmt=this.amendForm.amt;
    if(user.documents===undefined)
    {
      user.documents=this.mandateToAmend.documents;

    }
    user.mndRefNo=this.mandateToAmend.mndRefNo;
    user.mandateCategory=this.mandateToAmend.mandateCategory;

    this.httpClientModule.post(`${this.proxyUrl}/mnd/mandate/amendMandate`, user).subscribe((data: any) => {
      console.log("Success", data);
      console.log( "data from backend ==",data);
      this.saveStatus=data.status;
      this.mndRef=data;
      if(this.saveStatus=='SUCCESS')
      {

        this.msgType="SUCCESS";
        this.msg="Mandate request with mandate reference Id "+ this.mndRef.data +" ammended successfully and moved to Pending Authorization queue.";
       this.popupService.mandateSubmit(this.msg,this.successMsg,this.msgType).subscribe((status)=>{
        console.log("successStatus=",status);
        if(status=='OK')
        {
          this.ImageUrl="";
          this.router.navigate(['enquiry']);
          
         
          document.getElementById('createdDate').innerHTML="";
          this.sponBankName="";
         this.checkBoxValue=false;
         this.submitClicked="";
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
