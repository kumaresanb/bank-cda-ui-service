import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
  NgxDrpOptions,
  PresetItem,
  Range,
  RangeStoreService
} from "ngx-mat-daterange-picker";
import { PaymentEnquiryService } from "../services/payment/payment-enquiry-service";
import { LookupService } from "../services/lookupservice/plf-lookup-service";
import { SortingService } from "../services/sortingservice/sorting-service";
import { ConfigService } from "../services/config/config-service";

@Component({
  selector: "app-payment-enquiry",
  templateUrl: "./payment-enquiry.component.html",
  styleUrls: ["./payment-enquiry.component.scss"]
})
export class PaymentEnquiryComponent implements OnInit {
  //word split
  getSplitWord = function(item) {
    this.item1 = [];
    this.item2 = [];

    const res = item.split(" ");
    for (let i = 0; i <= 1; i++) {
      this.item1.push(res[i]);
    }

    for (let i = 2; i <= res.length; i++) {
      this.item2.push(res[i]);
    }
  };

  resultRangeValue: any;
  tableHeader: any = [];
  selected: any;
  mandateGridValue: any = [];
  range: Range = { fromDate: new Date(), toDate: new Date() };
  invalidDateRange: boolean = false;
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  gridsearch: any;
  paymentEnquiryForm: FormGroup;
  paymentTyp: any;
  queueStat: any;
  showGrid: any;
  noRecords: any;
  dateTimeFormat: any;
  searchDate: String;

  pageNumber: any;
  pageSize: any;
  sortClicked: boolean = false;
  totalRecords: any;
  totalPages: any;
  maxRecords: any;
  minRecords: any;
  paymentEnquiryGridSearchObj: any;
  gridSearchClicked: boolean = false;
  doesGridDataExistForSearch: boolean = true;
  doesGridDataExist: boolean = true;
  enquiryClicked: boolean = false;
  futureDateSelected: boolean = false;

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

  reset() {
    this.gridSearchClicked = false;
    this.paymentEnquiryGridSearchObj = new PaymentEnquiryGridSearchObj();
    this.paymentEnquiryForm.reset();
    this.invalidDateRange = false;
    this.mandateGridValue = [];
    this.showGrid = false;
    this.noRecords = false;
    this.currentDate();
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

  constructor(
    private paymentEnquiryService: PaymentEnquiryService,
    private datePipe: DatePipe,
    private lookupService: LookupService,
    private sortingService: SortingService,
    private configService: ConfigService,
    private rangeStoreService: RangeStoreService
  ) {
    this.paymentEnquiryGridSearchObj = new PaymentEnquiryGridSearchObj();
    this.dateTimeFormat = this.configService.getDateTimeFormat();
  }

  ngOnInit() {
    this.dateTimeFormat = this.configService.getDateTimeFormat();

    this.pageNumber = 1;
    this.pageSize = 10;
    this.minRecords = 1;
    this.selected = 10;
    this.maxRecords = 10;

    this.paymentEnquiryForm = new FormGroup({
      paymentType: new FormControl(),
      umrn: new FormControl(),
      amount: new FormControl(),
      accNumber: new FormControl(),
      achCode: new FormControl(),
      txnRefNum: new FormControl(),
      fileName: new FormControl(),
      queueStatus: new FormControl()
    });

    this.lookupService.getLookup("PAYMENT_TYPE").subscribe((data: any) => {
      this.paymentTyp = data.data;
    });

    this.lookupService.getLookup("QUEUES_STATUS").subscribe((data: any) => {
      this.queueStat = data.data;
    });

    this.resultRangeValue = [
      { value: "5", viewValue: "5" },
      { value: "10", viewValue: "10" },
      { value: "15", viewValue: "15" },
      { value: "20", viewValue: "20" }
    ];

    this.tableHeader = [
      "Payment Type",
      "Queue Status",
      "ACH Code",
      "File Name",
      "Payer Account Number",
      "Created Date and Time",
      "Amount",
      "Transaction Reference Number",
      "UMRN"
    ];
    const today = new Date();
    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: "d/MM/yyyy",
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit"
    };

    this.setupPresets();
    this.currentDate();
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.paymentEnquiryGridSearchObj;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.paymentEnquiryForm.value);
    }
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;

    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.paymentEnquiryGridSearchObj;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.paymentEnquiryForm.value);
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
      let searchObjectForGrid = this.paymentEnquiryGridSearchObj;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.paymentEnquiryForm.value);
    }
  }

  enquireFormSubmit(formDetails) {
    this.showGrid = false;
    this.gridSearchClicked = false;
    this.enquiryClicked = true;
    this.doesGridDataExistForSearch = true;
    this.paymentEnquiryGridSearchObj = new PaymentEnquiryGridSearchObj();
    if (
      this.paymentEnquiryForm.value.paymentType === undefined ||
      this.paymentEnquiryForm.value.paymentType === null
    ) {
      this.noRecords = true;
    } else {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.minRecords = 1;
      this.selected = 10;
      this.maxRecords = 10;
      this.fetchDataForGrid(formDetails);
      this.paymentEnquiryService
        .getCountForGrid(this.paymentEnquiryForm.value)
        .subscribe((data: any) => {
          this.totalRecords = data;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          if (this.totalRecords % this.pageSize === 0) {
            this.maxRecords = this.pageSize * this.pageNumber;
          } else if (this.totalRecords / this.pageSize >= 1) {
            this.maxRecords = this.pageSize;
          } else {
            this.maxRecords = this.totalRecords;
          }
        });
    }
  }

  fetchDataForGrid(formDetails) {
    var gridData = [];
    let searchObject = formDetails;
    searchObject.fromDate =   this.datePipe.transform(
      this.range.fromDate,
      "yyyy-MM-dd"
    );
    searchObject.toDate =  this.datePipe.transform(
      this.range.toDate,
      "yyyy-MM-dd"
    );
    searchObject.maxRecords = this.maxRecords;
    searchObject.minRecords = this.minRecords;

    this.paymentEnquiryService
      .paymentEnquiry(searchObject)
      .subscribe((data: any) => {
        this.mandateGridValue = [];
        gridData = data.data;
        // this.mandateGridValue = data.data;
        gridData.forEach(element => {
          element.splice(0, 1);
          this.queueStat.forEach(data1 => {
            if (element[1] == data1.valueOne) {
              element[1] = data1.value;
            }
          });
          this.mandateGridValue.push(element);
        });

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
        this.showGrid = true;
        this.enquiryClicked = true;
      });
  }

  gridSearch(enquiryObject: any) {
    this.paymentEnquiryGridSearchObj = enquiryObject;
    this.gridSearchClicked = true;
    enquiryObject.searchType = "grid";

    enquiryObject.paymentType = this.paymentEnquiryForm.value.paymentType;
    enquiryObject.umrn = this.paymentEnquiryForm.value.umrn;
    enquiryObject.accNumber = this.paymentEnquiryForm.value.accNumber;
    enquiryObject.achCode = this.paymentEnquiryForm.value.achCode;
    enquiryObject.txnRefNum = this.paymentEnquiryForm.value.txnRefNum;
    enquiryObject.fileName = this.paymentEnquiryForm.value.fileName;
    enquiryObject.queueStatus = this.paymentEnquiryForm.value.queueStatus;
    enquiryObject.amount = this.paymentEnquiryForm.value.amount;

    this.fetchDataForGrid(enquiryObject);
    this.getCount(enquiryObject);
  }

  getCount(enquiryObject) {
    this.paymentEnquiryService
      .getCountForGrid(enquiryObject)
      .subscribe((data: any) => {
        this.totalRecords = data;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.totalRecords % this.pageSize === 0) {
          this.maxRecords = this.pageSize * this.pageNumber;
        } else if (this.totalRecords / this.pageSize >= 1) {
          this.maxRecords = this.pageSize;
        } else {
          this.maxRecords = Math.ceil(this.totalRecords % this.pageSize);
        }
      });
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
}

export class PaymentEnquiryGridSearchObj {
  paymentType;
  umrn: "";
  accNumber;
  achCode: "";
  txnRefNum: "";
  fileName: "";
  queueStatus: "";
  fromDate: "";
  toDate: "";
  maxRecords: "";
  minRecords: "";
  amount: "";

  gridPaymentType: "";
  gridUmrn: "";
  gridAmt: "";
  gridAccNumber: "";
  gridAchCode: "";
  gridTxnRefNum: "";
  gridFileName: "";
  gridQueueType: "";
  searchType: any = "";
}
