import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DataService } from '../data-service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MandateSubmitPopupComponent } from "../mandate-submit-popup/mandate-submit-popup.component";
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-mandate',
  templateUrl: './create-mandate.component.html',
  styleUrls: ['./create-mandate.component.scss'],
})
export class CreateMandateComponent implements OnInit {
  myform: any;
  post:any;
  userDetails:any;
  imageExt:any;
  errorMsg:any;
  amtErr:any;
  selectedImage: File = null;
  ImageUrl: string;
  productDetails:any;
  categoryDetails:any;
  product:any;
  utilityCode:string="";
  sponsorBankCode:string="";
  productType:string="";
  productSelected:boolean=false;
  selectedProduct:string;
  routingDetails:any;
  sponserbk:any;
  sponserBankName:any=[];
  selectedProductDetails:any;
  todayDate:Date=new Date;
  minDate:Date=new Date;
  endingDate:Date=new Date;
  startingDate:Date=new Date;
  disableUpto:boolean=false;
  endDateDisabled:boolean=false;
  saveStatus:any;
  successMsg:any;
  failureMsg:any;
  msg:any;
  mndRef:any;
  msgType:any;
  imageUpload:any;
  proxyUrl:string = environment.proxyUrl;
  amount:any;
  crDate:any;
  sponBankName:any;
  submitClicked:any;
  checkBoxValue:boolean=false;
  sponsorBankErr:any;
  utilityCodeErr:any;
  dataIsThere:boolean=false;
  destBankNameDetails:any;
  destBankName:any;
  destBankNameErr:any;
  threeBankNameDisable: boolean = true;
   img=new Image();
   categoryCode:any;
   disableSubmitBtn :boolean = true;



  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

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

 

 // List<Document> (documents) :any;
  accountType = [
    // { value: 'Selectaccounttype', viewValue: 'Select Account Type' },
    { value: 'SAVINGS', viewValue: 'Savings' },
    { value: 'CURRENT', viewValue: 'Current' }
  ];

  amountTypes = [
    { value: 'F', viewValue: 'Fixed' },
    { value: 'V', viewValue: 'Variable' }

  ];

  frequencies = [
    { value: 'MNTH', viewValue: 'Monthly' },
    { value: 'QURT', viewValue: 'Quarterly' },
    { value: 'MIAN', viewValue: 'Half Yearly' },
    { value: 'YEAR', viewValue: 'Yearly' },
    { value: 'ADHO', viewValue: 'As and When Presented' },
   

  ];

  constructor(private httpClientModule:HttpClient,private router: Router,private dataService:DataService,private popupService:PopupService,public dialog: MatDialog) {
  }

  ngOnInit() {
    console.log('Create mandate ngOnInit');
          
    this.myformData();

          this.myform.utilityCode="";
          this.myform.sponsorBankCode="";


          //methode to bring active products from product_codes table
          this.dataService.getActiveProduct().subscribe(data=>{
            this.productDetails = data;
            console.log("product details in create",this.productDetails);
          },err=>{
            console.log("Error while fetching ActiveProducts", err);
          })

          this.dataService.getCategories().subscribe(data=>{
            this.categoryDetails = data;
            console.log("product details in create",this.categoryDetails);
          },err=>{
            console.log("Error while fetching categories", err);
          })

          this.startingDate=this.myform.startDate;

  }

  myformData(){

    this.myform = new FormGroup({
      // Product: new FormControl(""),
      ImageUrl:new FormControl(""),
      umrn: new FormControl(""),
      uploadedImage:new FormControl(""),
      utilityCode: new FormControl(""),
      payerAccNum: new FormControl("",Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]{5,34}$"),
       
      ])),
      payerBankCode: new FormControl("",Validators.compose([
        Validators.required,
       // Validators.pattern("^[A-Za-z0-9]{1,11}$"),
       

      ])),
      amt: new FormControl("",Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9_]{1,9}$"),
        //Validators.minLength(1),
        //Validators.maxLength(9)
      ])),
      sponsorBankCode: new FormControl(""),
      destBankName: new FormControl(""),
      consumerRefNo: new FormControl("",Validators.compose([
        Validators.pattern("^[A-Za-z0-9]{1,100}$"),
       // Validators.minLength(1),
        //Validators.maxLength(100)
      ])),
      schemeRefNo: new FormControl("",Validators.compose([
        Validators.pattern("^[A-Za-z0-9]{1,100}$"),
       
       // Validators.maxLength(100)
      ])),
      payerName: new FormControl("",Validators.compose([
        Validators.required,
        Validators.pattern("^[A-Za-z0-9 ]{1,40}$"),
        //Validators.minLength(1),
        //Validators.maxLength(40)
      ])),
      telNo: new FormControl(""),
      payerMobileNo: new FormControl("",Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9_]{1,34}$"),
        //Validators.maxLength(34)
      ])),
      payerEmail: new FormControl("",Validators.compose([
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{1,100}$"),
        //Validators.maxLength(100)
      ])),
      payerAccType: new FormControl("", Validators.compose([
        
      ])),
      mandateFrequency: new FormControl(""),
      untilCancel: new FormControl(false),
      createdDate:new FormControl(""),
      startDate:new FormControl("",Validators.compose([
        Validators.required
      ])),
      endDate:new FormControl("",Validators.compose([])),
      // categoryCode: new FormControl("", Validators.compose([
      //   Validators.required
      // ])),
      amountType:new FormControl(null),
      payerAccNo:new FormControl("",Validators.compose([
        Validators.pattern("^[A-Za-z0-9]{5,34}$"),
       // Validators.minLength(5),
       // Validators.maxLength(34)
      ])),
      custAddId:new FormControl(''),
      // frequency:new FormControl(null),
    });

  }



  startDateChanged(event){
    console.log("start date changed====",event);
    this.endingDate=event;

  }

  addDecimal(event){
    //console.log("amount enterded=",event)
   
    this.amount=event+".00";
    
    console.log("amount enterded=",this.amount);
  }

  

  clear(user){
    this.myform.reset();
    this.productType="";
    this.submitClicked="";
    this.checkBoxValue=false;
    this.disableUpto=false;
  }

  endDateChanged(event){
    console.log("end date changed====",event);
    this.startingDate=event;
    this.disableUpto=true;
    this.disableSubmitBtn=false;

  }

  untillCancelClicked(event){
    console.log("until cancel selected event ====",event);
    console.log("until cancel selected====",event.checked);
      
      this.endDateDisabled=true;
      this.disableUpto=false;
      if(event.checked==false)
      {
        this.disableSubmitBtn=true;
        this.endDateDisabled=false;

      }else{
        this.disableSubmitBtn=false;
      }

  }



  onKeyForProduct(event)
  {

    this.dataService.getActiveProduct().subscribe(data=>{
      this.productDetails = data;
      this.productSelected=true;
      for(var i=0;i<this.productDetails.data.length;i++)
      {
        console.log('this.productDetails.data[i] ==>',this.productDetails.data[i]);
        if(this.productDetails.data[i].productName===event.value)
        {

          this.myform.utilityCode=this.productDetails.data[i].achId;
          this.myform.sponsorBankCode=this.productDetails.data[i].sponserBankCode;
          this.selectedProductDetails=this.productDetails.data[i];
          this.dataService.getRoutingCodeDetails(this.myform.sponsorBankCode).subscribe((data)=>{
            this.sponserBankName = data;
            this.sponBankName=this.sponserBankName.data[0].bankName
          },err=>{
            console.log("Error while fetching ActiveProducts", err);
          })
         
        }
      }
      
    },err=>{
      console.log("Error while fetching ActiveProducts", err);
    })
  }

  onKeyForCategory(event)
  {
    this.categoryCode=event.value;

  }
  onKeyForSponserBank(event)
  {
    console.log(event.target.value);
    
      for(var i=0;i<=this.productDetails.data.length-1;i++)
      {
          if(this.productDetails.data[i].sponserBankCode==event.target.value)
              {
                this.sponsorBankErr="";
                this.dataIsThere=true;
                break;
              }
              else{
                this.dataIsThere=false;
              }
           
      }

      if(this.dataIsThere)
      {
        this.productType=this.productDetails.data[i].productName;
        this.myform.sponsorBankCode=this.productDetails.data[i].sponserBankCode;
        this.myform.utilityCode=this.productDetails.data[i].achId;
        this.sponsorBankErr="";
        this.threeBankNameDisable = false;
        this.dataService.getRoutingCodeDetails(this.myform.sponsorBankCode).subscribe((data)=>{
            this.sponserBankName = data;
            this.sponBankName=this.sponserBankName.data[0].bankName
          },err=>{
            console.log("Error while fetching ActiveProducts", err);
          })
       
      }
      else
      {
        this.threeBankNameDisable = true;
        this.sponsorBankErr="Please provide valid Sponser Bank Code.";
        this.productType="";
        this.myform.utilityCode="";
        this.sponBankName ="";
        }
      }

  onKeyForDestBank(event)
  {
    console.log(event.target.value);
    this.dataService.getRoutingCodeDetails(event.target.value).subscribe((data)=>{
      this.destBankNameDetails = data;
      this.destBankName=this.destBankNameDetails.data[0].bankName;
      this.destBankNameErr="";
      this.threeBankNameDisable = false;

      return;
    },err=>{
      console.log("Error while fetching ActiveProducts", err);
      this.destBankName = "";
      this.threeBankNameDisable = true;

      this.destBankNameErr="Please provide valid Destination bank code";
    })
    this.destBankNameErr="Please provide valid Destination bank code";
    this.destBankName="";
    this.threeBankNameDisable = true;

  }

  onKeyForUtilityCode(event){
    console.log(event.target.value);
    
      for(var i=0;i<=this.productDetails.data.length-1;i++)
    {
    if(this.productDetails.data[i].achId==event.target.value)
        {
                this.utilityCodeErr="";
                this.dataIsThere=true;
                break;
              }
              else{
                this.dataIsThere=false;
              }
           
      }

      if(this.dataIsThere)
      {
          this.productType=this.productDetails.data[i].productName;
        this.myform.sponsorBankCode=this.productDetails.data[i].sponserBankCode;
        this.myform.utilityCode=this.productDetails.data[i].achId;
        this.utilityCodeErr="";
        this.threeBankNameDisable = false;

        this.dataService.getRoutingCodeDetails(this.myform.sponsorBankCode).subscribe((data)=>{
          this.sponserBankName = data;
          this.sponBankName=this.sponserBankName.data[0].bankName
        },err=>{
          console.log("Error while fetching ActiveProducts", err);
        })
        }
      else
      {
        this.threeBankNameDisable = true;

        this.utilityCodeErr="Please provide valid Sponsor Bank Code.";
        this.productType="";
        this.myform.sponsorBankCode="";
        this.sponBankName="";
      }

    }




  // onKeyForUtilityCode(event){
  //   console.log(event.target.value);
  //   if(!this.productSelected)
  //   {
  //     for(var i=0;i<=this.productDetails.data.length;i++)
  //     {
  //   if(this.productDetails.data[i].achId==event.target.value)
  //       {
  //         this.utilityCodeErr="";
  //         this.productType=this.productDetails.data[i].productName;
  //         this.myform.sponsorBankCode=this.productDetails.data[i].sponserBankCode;
  //         console.log(this.productDetails.data[i]);
  //         console.log("s elected product is", this.productType)
  //       }
  //       else{
  //         this.utilityCodeErr="Please provide valid Utility Code.";
  //         this.myform.sponsorBankCode="";
  //         this.productType="";
  //       }
  //     }

  //   }
  // }





  //methode to upload image and do related validation
  onFileSelected(event) {
          console.log(event);
          this.selectedImage = event.target.files[0];
          this.img.src = event.target.result;
          var reader = new FileReader();
          this.imageExt=this.selectedImage.name.split('.')[1]
          this.errorMsg="";
          if(this.imageExt==='jpg' || this.imageExt==='jpeg' )
          {

          }
          else{
            this.msg="Invalid Image, Only JPG and JPEG is allowed with size of max 100kb and max resolution of 500 DPI.";
            this.successMsg="ERROR";
            this.msgType="FAILED"
            this.img.src="";
            this.ImageUrl="";
            this.imageUpload="";
            this.popupService.mandateSubmit(this.msg,this.successMsg,this.msgType).subscribe((status)=>{
              console.log("successStatus=",status);
              //this.ImageUrl="";
            })
            //this.ImageUrl="";
            this.myform.uploadedImage.reset();

          }
          if(this.selectedImage.size>100000 )
          {
            this.msg="Invalid Image, Only JPG and JPEG is allowed with size of max 100kb and max resolution of 500 DPI.";
            this.successMsg="ERROR";
            this.msgType="FAILED"
            
            
            this.imageUpload="";
            this.popupService.mandateSubmit(this.msg,this.successMsg,this.msgType).subscribe((status)=>{
              console.log("successStatus=",status);
              //this.ImageUrl="";
            })
            
            this.myform.uploadedImage.reset();
          }
          else{
            this.ImageUrl="";
            this.errorMsg="";
            
          }

          reader.onload = (event: any) => {

            if(this.errorMsg=="")
            {
              this.ImageUrl = event.target.result;
            }
            //console.log("Image Details",this.ImageUrl);
          }
          reader.readAsDataURL(this.selectedImage);

  }

  ngSubmit(user) {
    if(this.submitClicked=="clicked")
    {
      return
    }

    this.submitClicked="clicked";
    this.successMsg="SUBMITTED";
    this.failureMsg="FAILED";
           console.log(this.imageExt);
           user.documents=[{
           image:this.ImageUrl,
           docFileName:this.selectedImage.name,
           docType:this.selectedImage.type,
           docExtention:this.selectedImage.name.split('.')[1],
           fileString:this.ImageUrl.split(',')[1],

           }];
            user.product=this.selectedProductDetails;
          console.log(user);
          user.utilityCode=this.myform.utilityCode;
          user.sponsorBankCode=this.myform.sponsorBankCode;
          user.mandateCategory=this.categoryCode;
           if(this.myform.untilCancel==false && this.myform.endDate==null){
            this.disableSubmitBtn = true;
            return 
           }



          this.httpClientModule.post(`${this.proxyUrl}/mnd/mandate/save`, user)
          .subscribe(
            (data:any)=>
            {
              console.log( "data from backend ==",data);
              this.saveStatus=data.status;
              this.mndRef=data;
              if(this.saveStatus=='SUCCESS')
              {

                this.msgType="SUCCESS";
                this.msg="Mandate request with mandate reference Id "+ this.mndRef.data +" generated successfully and moved to Pending Authorization queue.";
               this.popupService.mandateSubmit(this.msg,this.successMsg,this.msgType).subscribe((status)=>{
                console.log("successStatus=",status);
                if(status=='OK')
                {
                  this.ImageUrl="";
                  
                 
                  document.getElementById('createdDate').innerHTML="";
                  this.sponBankName="";
                 this.checkBoxValue=false;
                 this.submitClicked="";
                // this.productDetails=[];
                  this.myform.reset();
                  this.ngOnInit();
                  this.myform.push({"utilityCode":new FormControl(""),"sponsorBankCode":new FormControl("")});
                  this.myform.value.sponsorBankCode="";
                  this.myform.value.utilityCode="";
                  // console.log(`this.myform.value.utilityCode   : ${this.myform.value.utilityCode}`);
                  // console.log(`this.myform.value.sponsorBankCode   : ${this.myform.value.sponsorBankCode}`);
                 
                  this.productType="";
                  this.myformData();
                  this.disableUpto=false;
                   this.dataService.getActiveProduct().subscribe(data=>{
                     this.productDetails = data;
                     console.log("product details in create",this.productDetails);
                   },err=>{
                     console.log("Error while fetching ActiveProducts", err);
                   })
                }
                else{
                  //this.router.navigate(['/MandateWorkbenchComponent']);
                  this.router.navigate(['mandate']);
                }
               
              })
              }
            },(Error)=>{
              this.msgType="FAILURE";
              this.msg="Mandate creation failed";
              this.popupService.mandateSubmit(this.msg,this.failureMsg,this.msgType).subscribe((status)=>{
                console.log("failure Status=",status);
                this.submitClicked="";
               // this.disableUpto=false;

              })

            }

            )
  }


}
