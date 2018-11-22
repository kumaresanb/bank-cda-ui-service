import { $AMPERSAND } from "@angular/compiler/src/chars";
import { Component, OnInit } from "@angular/core";
import { WorkBenchService } from "../services/mandate/workbench/workbench-service";
import { AuthenticationService } from "../services/authentication/login/login.service";
import { Router } from "@angular/router";
import { forEach } from "@angular/router/src/utils/collection";
import { isNgTemplate } from "@angular/compiler";

@Component({
  selector: "app-mandate-workbench",
  templateUrl: "./mandate-workbench.component.html",
  styleUrls: ["./mandate-workbench.component.scss"]
})
export class MandateWorkbenchComponent implements OnInit {
  //word split
  getSplitWord = function(item){
    this.item1 = [];
    this.item2 = [];
       
     var res = item.split(" ");
     for(var i = 0; i <= 1; i++){
      this.item1.push(res[i]);
     }

     for(var i = 2; i <= res.length; i++){
      this.item2.push(res[i]);
     }	          
 };

  resultRangeValue: any;
  tableHeader: any = [];
  selected: any;
  mandateGridValue: any = [];

  bankStatus: any[];
  corpStatus: any[];
  confirmationStatus: any[];
  ageingStatus: any[];
  mandateDetails: any[];

  paperMandateTotalCount: number = 0;
  eMandateTotalCount: number = 0;
  searchObjJSON: any;
  mandateObj: any[];

  qDesc: any;
  dateFormat: any;
  showAuthAction: boolean;
  checkedForAll: boolean;
  checked: boolean;
  qCount: any;
  showingRows: any = 10;

  previousDisabled: boolean;
  nextDisabled: boolean;
  gridsearch: boolean;

  pagination = {
    currPage: 1,
    pageSize: 0,
    totalPages: 0
  };
  searchObj = {
    consumerRefNo: "",
    mndRefNo: "",
    payerBankCode: "",
    sponsorBankCode: "",
    payerAccNum: "",
    payerName: "",
    mandateType: "",
    lastModifiedDate: "",
    statusDesc: "",
    currPage: 0,
    pageSize: this.showingRows,
    queueCode: "",
    mndSource: "",
    amt: "",
    createdBy: "",
    createdDate: ""
  };

  constructor(
    private workBenchService: WorkBenchService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.dateFormat = this.authenticationService.dtFormat;
    this.showAuthAction = false;
    this.checkedForAll = false;
  }

  gridsearchTable(event) {
    this.fetchDataOnSelectedCorpQue(
      this.qDesc,
      this.searchObj.queueCode,
      this.qCount
    );
  }

  previousButtonClicked(event) {
    this.pagination.currPage = this.pagination.currPage  - 1;
    this.buttonStatus();
    this.fetchDataOnSelectedCorpQue(
      this.qDesc,
      this.searchObj.queueCode,
      this.qCount
    );

  }

  nextButtonClicked(event) {
    this.pagination.currPage = this.pagination.currPage  + 1;
    this.buttonStatus();
    this.fetchDataOnSelectedCorpQue(
      this.qDesc,
      this.searchObj.queueCode,
      this.qCount
    );

  }

  changeTabIndex(selectedIndex) {
    sessionStorage.setItem("si", selectedIndex);
  }

  fetchDataOnSelectedCorpQue(qDesc, queueDetails, qCount) {
    console.log("queueDetails=", queueDetails);
    if (queueDetails === "PSA-300") {
      this.showAuthAction = true;
    } else {
      this.showAuthAction = false;
    }
    this.searchObj.queueCode = queueDetails;
    this.searchObj.currPage = this.pagination.currPage - 1;
    this.qDesc = qDesc;
    this.qCount = qCount;
    console.log(JSON.stringify(this.searchObj));
    this.workBenchService
      .getMandatesOnQueStatus(this.searchObj)
      .subscribe((resp: any) => {
        this.mandateObj = resp.data.content;
        this.pagination.totalPages = Math.ceil(this.qCount / this.showingRows);
        console.log("response from  getMandatesOnQueStatus()", this.mandateObj);
      });
  }

  fetchDataOnSelectedBankQue(qDesc, queueDetails, qCount) {
    console.log("queueDetails=", queueDetails);
    this.showAuthAction = false;
    this.searchObj.queueCode = queueDetails;
    this.qDesc = qDesc;
    this.qCount = qCount;
    this.searchObj.mndSource = "BANK";
    this.workBenchService
      .getMandatesOnQueStatus(this.searchObj)
      .subscribe((resp: any) => {
        this.mandateObj = resp.data.content;
        console.log("response from  getMandatesOnQueStatus()", this.mandateObj);
      });
  }

  viewMandate(mndRefNo) {
    this.router.navigate(["viewmandate", { mndRefNum: mndRefNo }]);
  }

  ngOnInit() {
    this.showAuthAction = true;
    this.workBenchService.getBankStatus().subscribe(
      (resp: any) => {
        this.bankStatus = resp.data;
        console.log("Received BankStatus", this.bankStatus);
      },
      err => {
        console.log(`Error on fetching bankStatus ${JSON.stringify(err)}`);
      }
    );

    this.workBenchService.getCorpStatus().subscribe(
      (resp: any) => {
        this.corpStatus = resp.data;
        this.corpStatus.forEach((item, index) => {
          console.log(item);
          if (item[1] === "PSA-300") {
            this.qCount = item[0];
          }
        });
      },
      err => {
        console.log(`Error on fetching corpStatus`, JSON.stringify(err));
      }
    );

    this.fetchDataOnSelectedCorpQue(
      "Pending Authorization",
      "PSA-300",
      this.qCount
    );

    this.workBenchService.getConfirmationStatus().subscribe(
      (resp: any) => {
        this.paperMandateTotalCount=0;
        this.eMandateTotalCount=0;
        this.confirmationStatus = resp.data;
        this.confirmationStatus.forEach(item => {
          this.paperMandateTotalCount += Number(item[0]);
          this.eMandateTotalCount += Number(item[1]);
        });

        console.log("Confirmation Status", resp);
      },
      err => {
        console.log(`Error on fetching corpStatus ${err}`);
      }
    );

    this.workBenchService.getAgeingStatus().subscribe(
      (resp: any) => {
        this.ageingStatus = resp.data;
        console.log("Ageing Status", resp);
      },
      err => {
        console.log(`Error on fetching corpStatus ${err}`);
      }
    );

    this.resultRangeValue = [
      {
        value: "5",
        viewValue: "5"
      },
      {
        value: "10",
        viewValue: "10"
      },
      {
        value: "15",
        viewValue: "15"
      },
      {
        value: "20",
        viewValue: "20"
      }
    ];

    this.selected = "10";
    this.tableHeader = [
      "Mandate Reference ID",
      "Request Type",
      "Mandate Type",
      "Amount",
      "Account Number",
      "Payee Bank Code",
      "Created By",
      "Created Date and Time"
    ];
  }

  pageChanged(event) {
    console.log("page changed details===", event.target.value);
    this.showingRows = event.target.value;
    this.searchObj.pageSize = this.showingRows;
    this.fetchDataOnSelectedCorpQue(
      this.qDesc,
      this.searchObj.queueCode,
      this.qCount
    );
  }

  paginationReset() {
    this.pagination.currPage = 1;
    this.pagination.pageSize = 0;
    this.pagination.totalPages = 0;
  }
  buttonStatus() {
    if (this.pagination.currPage <= 1) {
      this.previousDisabled = true;
    } else {
      this.previousDisabled = false;
    }
    if (this.pagination.totalPages <= this.pagination.currPage) {
      this.nextDisabled = true;
    } else {
      this.nextDisabled = false;
    }
  }

  refresh(){
    this.ngOnInit();
  }
}
