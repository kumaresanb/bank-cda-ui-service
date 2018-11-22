import { RangeStoreService } from "ngx-mat-daterange-picker";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DataService } from "../data-service";
import { MandateEnquiryService } from "../services/mandate/mandateenquiry-service/mandateenquire-service";
import { RoutingWithObject } from "../services/mandate/routingService/routingwithobject";
import { Router } from "@angular/router";
import { MatRadioButton } from "@angular/material";
import { MatRadioChange } from "@angular/material";
import { AuthenticationService } from "../services/authentication/login/login.service";
import { stringify } from "querystring";
import { LookupService } from "../services/lookupservice/plf-lookup-service";
import { NgxDrpOptions, PresetItem, Range } from "ngx-mat-daterange-picker";
import { DatePipe } from "@angular/common";
import { ConfigService } from "../services/config/config-service";
import { SortingService } from "../services/sortingservice/sorting-service";

@Component({
  selector: "app-mandate-enquiry",
  templateUrl: "./mandate-enquiry.component.html",
  styleUrls: ["./mandate-enquiry.component.scss"]
})
export class MandateEnquiryComponent implements OnInit {
  //word split
  getSplitWord = function(item) {
    this.item1 = [];
    this.item2 = [];

    var res = item.split(" ");
    for (var i = 0; i <= 1; i++) {
      this.item1.push(res[i]);
    }

    for (var i = 2; i <= res.length; i++) {
      this.item2.push(res[i]);
    }
  };

  @ViewChild("tablescroll", { read: ElementRef })
  public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({
      left: this.tablescroll.nativeElement.scrollLeft + 300,
      behavior: "smooth"
    });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({
      left: this.tablescroll.nativeElement.scrollLeft - 300,
      behavior: "smooth"
    });
  }

  pageSize: any;

  resultRangeValue: any;
  tableHeader: any = [];
  selected: any;
  mandateGridValue: any = [];
  ObjectEnquire: any = {};
  mandateRefNo: any;
  mandateSubType: any = "ongoingmandates";
  enquiryForm: FormGroup;
  enquiryClicked: boolean = false;
  filter: any;
  ongoingmandatesEnabled: boolean = true;
  activeMandatesEnabled: boolean;
  dtFormat: any;
  mandateType: any = [];
  requestType: any;
  queueType: any;
  maxRecords: any;
  minRecords: any;
  noRecords: any;
  processStatus: any;
  questat: any;
  totalRecords: any;
  totalPages: any;
  dateTimeFormat: any;
  sortClicked: any;
  doesGridDataExistForSearch: boolean = true;
  doesGridDataExist: boolean = true;
  pageNumber: any;
  gridSearchClicked: boolean = false;
  futureDateSelected: boolean = false;
  enquirySearchObj: EnquirySearchObj = new EnquirySearchObj();
  // achCode: any;
  queStatus: any = [];
  range: Range = { fromDate: new Date(), toDate: new Date() };
  invalidDateRange: boolean = false;
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  userRole:any;

  constructor(
    private dataServc: DataService,
    private lookupService: LookupService,
    private mandateEnquiryService: MandateEnquiryService,
    private routeWithObject: RoutingWithObject,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private sortingService: SortingService,
    private rangeStoreService: RangeStoreService,
    private configService: ConfigService,
    private router: Router,
    private authService:AuthenticationService

  ) {
    // this.enquiryClicked = false;
    this.dateTimeFormat = this.configService.getDateTimeFormat();
  }
  reset(source) {
    if (source == "external") {
      this.mandateSubType = "ongoingmandates";
      this.getQueues("ongoingmandates");
      this.noRecords = true;
      this.enquiryClicked = false;
    }
    this.questat = undefined;
    this.gridSearchClicked = false;
    this.enquirySearchObj = new EnquirySearchObj();
    this.enquiryForm.reset();
    let today = new Date();
    this.rangeStoreService.updateRange(today, today);
  }

  currentDate() {
    const today = new Date();
    this.options = {
      presets: this.presets,
      format: "d/MM/yyyy",
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit"
    };
  }

  updateRange(range: Range) {
    var fromDateInMilliSeconds = range.fromDate.valueOf();
    var toDateInMilliSeconds = range.toDate.valueOf();
    var currentDateInMilliSeconds = new Date().valueOf();
    if (!(toDateInMilliSeconds > currentDateInMilliSeconds)) {
      this.futureDateSelected = false;
      if (toDateInMilliSeconds >= fromDateInMilliSeconds) {
        this.invalidDateRange = false;
        this.range = range;
      } else {
        this.invalidDateRange = true;
      }
    } else {
      this.futureDateSelected = true;
    }
  }

  setupPresets() {
    const backDate = numOfDays => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    };

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7);
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      {
        presetLabel: "Yesterday",
        range: { fromDate: yesterday, toDate: today }
      },
      {
        presetLabel: "Last 7 Days",
        range: { fromDate: minus7, toDate: today }
      },
      {
        presetLabel: "Last 30 Days",
        range: { fromDate: minus30, toDate: today }
      },
      {
        presetLabel: "This Month",
        range: { fromDate: currMonthStart, toDate: currMonthEnd }
      },
      {
        presetLabel: "Last Month",
        range: { fromDate: lastMonthStart, toDate: lastMonthEnd }
      }
    ];

    this.datePipe.transform(this.range.toDate, "ddMMyyyy");
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.enquirySearchObj;
      searchObjectForGrid.mandateSubType = this.enquiryForm.value.selectedmandateType;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.enquiryForm.value);
    }
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.enquirySearchObj;
      searchObjectForGrid.mandateSubType = this.enquiryForm.value.selectedmandateType;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.enquiryForm.value);
    }
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    if (this.pageNumber === this.totalPages) {
      this.maxRecords = this.totalRecords;
    } else {
      this.maxRecords = this.pageSize * this.pageNumber;
    }
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.enquirySearchObj;
      searchObjectForGrid.mandateSubType = this.enquiryForm.value.selectedmandateType;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.enquiryForm.value);
    }
  }

  queChanged(queue) {
    this.questat = queue;
  }
  ngOnInit() {
    this.userRole=this.authService.loggedInUser.role.roleType;
    this.dateTimeFormat = this.configService.getDateTimeFormat();
    this.pageNumber = 1;
    this.pageSize = 10;
    this.minRecords = 1;
    this.selected = 10;
    this.maxRecords = 10;

    this.requestType = "ENQUIRY";
    this.queueType = "MANDATE";

    this.enquiryForm = new FormGroup({
      mandateSubType: new FormControl("ongoingmandates"),
      selectedmandateType: new FormControl(),
      umrn: new FormControl(),
      amt: new FormControl(),
      payeeAccNumber: new FormControl(),
      achCd: new FormControl(),
      mndRefNumber: new FormControl(""),
      fileName: new FormControl(""),
      queueStatus: new FormControl("")
    });
    this.lookupService.getLookup("MANDATES_TYPE").subscribe((data: any) => {
      this.mandateType = data.data;
    });
    this.enquiryClicked = false;
    this.getQueues("ongoingmandates");

    this.resultRangeValue = [
      { value: "5", viewValue: "5" },
      { value: "10", viewValue: "10" },
      { value: "15", viewValue: "15" },
      { value: "20", viewValue: "20" }
    ];

    this.selected = "10";
    if (this.mandateSubType == "ongoingmandates") {
      this.tableHeader = [
        "Mandate Type",
        "UMRN",
        "Amount",
        "Payee Account Number",
        "ACH Code",
        "Created Date and Time",
        "Mandate Reference Number",
        "File Name",
        "Queue Status",
        "AMEND"
      ];
    } else {
      this.tableHeader = [
        "Mandate Type",
        "UMRN",
        "Amount",
        "Payee Account Number",
        "ACH Code",
        "Created Date and Time",
        "Mandate Reference Number",
        "File Name",
        "Mandate Status"
      ];
    }

    this.setupPresets();
    this.currentDate();
  }

  getQueues(mandateSubType) {
    if (mandateSubType == "ongoingmandates") {
      this.lookupService
        .getLookup("MANDDATE_QUEUES_STATUS")
        .subscribe((data: any) => {
          this.queStatus = data.data;
          this.tableHeader = [
            "Mandate Type",
            "UMRN",
            "Amount",
            "Payee Account Number",
            "ACH Code",
            "Created Date and Time",
            "Mandate Reference Number",
            "File Name",
            "Queue Status"
          ];
        });
    } else {
      this.lookupService
        .getLookup("MANDATES_CONFIRMED_STATUS")
        .subscribe((data: any) => {
          this.queStatus = data.data;
          this.tableHeader = [
            "Mandate Type",
            "UMRN",
            "Amount",
            "Payee Account Number",
            "ACH Code",
            "Created Date and Time",
            "Mandate Reference Number",
            "File Name",
            "Mandate Status"
          ];
        });
    }
  }

  enquiryStatus(event: any) {
    this.enquiryClicked = false;
    this.reset("internal");
    this.enquiryForm.value.mandateGridValue = this.mandateGridValue = [];
    this.mandateSubType = event._value;

    this.lookupService.getLookup("MANDATES_TYPE").subscribe((data: any) => {
      this.mandateType = data.data;
    });
    this.getQueues(event._value);
  }

  enquiry(enquiryForm) {
    this.enquiryClicked = true;
    this.gridSearchClicked = false;
    this.doesGridDataExistForSearch = true;
    if (
      this.enquiryForm.value.selectedmandateType === undefined ||
      this.enquiryForm.value.selectedmandateType === null
    ) {
      this.noRecords = true;
    } else {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.minRecords = 1;
      this.selected = 10;
      this.maxRecords = 10;
      this.fetchDataForGrid(enquiryForm);
    }
  }

  fetchDataForGrid(enquiryForm) {
    // this.mandateGridValue = [];
    var gridData = [];
    let searchObject = enquiryForm;
    searchObject.mandateSubType = this.mandateSubType;

    if (this.questat === undefined) {
      if (this.mandateSubType == "ongoingmandates") {
        searchObject.queueStatus = "";
        searchObject.processStatus = "";
        searchObject.processStatus = "";
      }
    } else {
      if (this.mandateSubType == "ongoingmandates") {
        searchObject.queueStatus = this.questat.valueOne;
        searchObject.processStatus = "";
      } else {
        searchObject.queueStatus = this.questat.valueOne;
        searchObject.processStatus = this.questat.valueTwo;
      }
    }
    searchObject.mandateType = enquiryForm.selectedmandateType;
    searchObject.mndRefNo = enquiryForm.mndRefNumber;
    searchObject.achCode = enquiryForm.achCd;
    searchObject.startDate = 
    this.datePipe.transform(
      this.range.fromDate,
      "yyyy-MM-dd"
    );
    searchObject.endDate = this.datePipe.transform(
      this.range.toDate,
      "yyyy-MM-dd"
    );
    searchObject.payerAccNum = enquiryForm.payeeAccNumber;
    searchObject.maxRecords = this.maxRecords;
    searchObject.minRecords = this.minRecords;
    searchObject.requestType = this.requestType;
    searchObject.queueType = this.queueType;
    if (searchObject.umrn == "") {
      searchObject.umrn = null;
    }
    this.mandateEnquiryService.getEnquiryData(searchObject).subscribe(
      (data: any) => {
        this.mandateGridValue = gridData = data.data;

        this.getPagination(searchObject);

        if (
          this.mandateGridValue === null ||
          this.mandateGridValue.length == 0
        ) {
          if (this.gridSearchClicked) {
            this.doesGridDataExist = false;
            this.doesGridDataExistForSearch = false;
          } else {
            this.noRecords = true;
          }
        } else {
          if (this.gridSearchClicked) {
            this.doesGridDataExistForSearch = true;
            this.doesGridDataExist = true;
          } else {
            this.noRecords = false;
          }
        }
      },
      err => {
        console.log("Error in fetching Data for grid", err);
      }
    );
  }
  viewOfEnquery(mndRefNo) {
    this.router.navigate(["viewmandate", { mndRefNum: mndRefNo }]);
  }

  sortGrid(index) {
    this.sortClicked = !this.sortClicked;
    if (this.sortClicked) {
      this.sortingService
        .sortGrid(index, this.mandateGridValue, "asc")
        .subscribe(data => {
          this.mandateGridValue = data;
        });
    } else {
      this.sortingService
        .sortGrid(index, this.mandateGridValue, "dsc")
        .subscribe(data => {
          this.mandateGridValue = data;
        });
    }
  }

  gridSearch(enquiryObject: any) {
    this.enquirySearchObj = enquiryObject;
    this.gridSearchClicked = true;
    this.maxRecords = this.pageSize;
    enquiryObject.mandateSubType = this.mandateSubType;
    enquiryObject.selectedmandateType = this.enquiryForm.value.selectedmandateType;
    enquiryObject.umrn = this.enquiryForm.value.umrn;
    enquiryObject.payeeAccNumber = this.enquiryForm.value.payeeAccNumber;
    enquiryObject.achCd = this.enquiryForm.value.achCd;
    enquiryObject.mndRefNumber = this.enquiryForm.value.mndRefNumber;
    enquiryObject.fileName = this.enquiryForm.value.fileName;
    enquiryObject.queueStatus = this.enquiryForm.value.queueStatus;

    enquiryObject.searchType = "grid";
    this.fetchDataForGrid(enquiryObject);
    this.getPagination(enquiryObject);
  }
  getPagination(enquiryObject) {
    this.mandateEnquiryService
      .getCountForGrid(enquiryObject)
      .subscribe((data: any) => {
        this.totalRecords = data;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.totalRecords % this.pageSize === 0) {
          this.maxRecords = this.pageSize * this.pageNumber;
        } else {
          this.maxRecords =
            this.pageSize * (this.pageNumber - 1) +
            this.mandateGridValue.length;
        }
      });
  }
  amendMandate(data) {
      this.router.navigate(["ammendmandate", { mndRefNum:data }]);
  }

  cancelMandate(data) {
    this.router.navigate(["cancelmandate", { mndRefNum:data }]);
}


  
  // amendMandate(data){
  //   this.routeWithObject.routingObject=data;
  //   this.router.navigate(['ammendmandate']);
  // }


}



export class EnquirySearchObj {
  mandateSubType: ""; // In Progress or Confirm
  selectedmandateType: ""; // Paper Mandate or E-Mandate
  umrn: "";
  amt: "";
  payeeAccNumber: "";
  achCd: "";
  mndRefNumber: "";
  fileName: "";
  queueStatus: "";
  startDate: "";
  endDate: "";
  maxRecords: "";
  minRecords: "";
  lastModifiedDate: "";
  requestType: "";
  queueType: "";
  processStatus: "";

  gridSelectedMandateType: "";
  gridUmrn: "";
  gridAmt: "";
  gridPayeeAccNumber: "";
  gridAchCd: "";
  gridMndRefNo: "";
  gridFileName: "";
  gridQueueType: "";
  gridProcessStatus: "";
  searchType: any = "";
}

export class MandateSearchObject {
  mandateType: any;
  mndRefNo: any;
  mandateSubType: any;
  payerAccNum: any;
  umrn: any;
  achCode: any;
  amt: any;
  startDate: any;
  endDate: any;
  fileName: any;
  maxRecords: any;
  minRecords: any;
  queueStatus: any;
  lastModifiedDate: any;
  requestType: any;
  queueType: any;
  processStatus: any;
}
