import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  NgxDrpOptions,
  PresetItem,
  Range,
  RangeStoreService
} from "ngx-mat-daterange-picker";
import { LookupService } from "../services/lookupservice/plf-lookup-service";
import { FormGroup, FormControl } from "@angular/forms";
import { ReportService } from "../services/report/report-service";
import { ConfigService } from "../services/config/config-service";
import { saveAs } from "file-saver";
import { DatePipe } from "@angular/common";
import { SortingService } from "../services/sortingservice/sorting-service";
import { SummaryReportService } from "../services/summary-report-service/SummaryReportService";
import { QueueNameService } from "../shared/queue-name-service";
@Component({
  selector: "app-mandate-report",
  templateUrl: "./mandate-report.component.html",
  styleUrls: ["./mandate-report.component.scss"]
})
export class MandateReportComponent implements OnInit {
  mandatereport: any;
  resultRangeValue: any;
  tableHeader: any = [];
  selected: any;
  mandateReportGrid: any;
  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  gridsearch: any;
  enquiryClicked: any;
  enquiryForm: FormGroup;
  noRecords = false;
  showGrid = false;
  pageNumber: any;
  pageSize: any;
  minRecords: any;
  maxRecords: any;
  totalRecords: any;
  totalPages: any;
  dateTimeFormat: any;
  dateFormat: any;
  requestType: any;
  queueType: any;
  invalidDateRange = false;
  queueStatusValue: any;
  fileName: any;
  mandateTypes = [];
  queueStatus = [];
  reportObject: ReportObject;
  sortClicked: any;
  futureDateSelected: boolean = false;
  mandateSubType: string = "";
  mandateTypeSummary: any = "ongoingmandates";
  summaryReportForm: FormGroup;
  summaryReportData: any;
  queueNames: any=[];
  totalCount:any;
  disableSubmit:boolean=false;


  processType = [{ value: "type", viewValue: "Type" }];

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

  reset(type) {
    if (type == "tabChange") {
      this.ngOnInit();
    }
    this.invalidDateRange = false;
    this.futureDateSelected = false;
    this.mandateReportGrid = [];
    this.showGrid = false;
    this.noRecords = false;
    let today = new Date();
    this.rangeStoreService.updateRange(today, today);
    this.queueStatusValue = null;
  }

  //Date range picker
  updateRange(range: Range) {
    this.futureDateSelected = false;
    this.invalidDateRange = false;
    const fromDateInMilliSeconds = range.fromDate.valueOf();
    const toDateInMilliSeconds = range.toDate.valueOf();
    const currentDateInMilliSeconds = new Date().valueOf();
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
  }

  constructor(
    private lookupService: LookupService,
    private configService: ConfigService,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private sortingService: SortingService,
    private rangeStoreService: RangeStoreService,
    private summaryReportService: SummaryReportService,
    private queueNameService: QueueNameService
  ) {}

  queueChanged(queue) {
    this.queueStatusValue = queue;
  }
  ngOnInit() {
    this.mandatereport = "Detailed Report";
    this.dateTimeFormat = this.configService.getDateTimeFormat();
    this.dateFormat = this.configService.getDateFormat();
    this.pageNumber = 1;
    this.pageSize = 10;
    this.minRecords = 1;
    this.selected = 10;
    this.maxRecords = 10;
    this.mandateSubType = "ongoingmandates";
    this.requestType = "ENQUIRY";
    this.queueType = "MANDATE";

    

    this.enquiryForm = new FormGroup({
      mandateSubType: new FormControl("ongoingmandates"),
      mandateType: new FormControl(),
      umrn: new FormControl(),
      amt: new FormControl(),
      payeeAccNumber: new FormControl(),
      achCd: new FormControl(),
      mndRefNumber: new FormControl(""),
      fileName: new FormControl(""),
      queueStatus: new FormControl("")
    });

    this.summaryReportForm = new FormGroup({
      paperEmandate: new FormControl(),
      summaryUtilityCode: new FormControl(),
      summaryFileName: new FormControl()
    });

    this.lookupService.getLookup("MANDATES_TYPE").subscribe((data: any) => {
      this.mandateTypes = data.data;
    });
    this.enquiryClicked = false;

    if (this.enquiryForm.value.mandateSubType === "ongoingmandates") {
      this.lookupService
        .getLookup("MANDDATE_QUEUES_STATUS")
        .subscribe((data: any) => {
          this.queueStatus = data.data;
        });
    } else {
      this.lookupService
        .getLookup("MANDATES_CONFIRMED_STATUS")
        .subscribe((data: any) => {
          this.queueStatus = data.data;
        });
    }
    this.resultRangeValue = [
      { value: "5", viewValue: "5" },
      { value: "10", viewValue: "10" },
      { value: "15", viewValue: "15" },
      { value: "20", viewValue: "20" }
    ];
    this.selected = "10";

    this.tableHeader = [];

    this.mandateReportGrid = [];

    const today = new Date();
    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: "d/MM/yyyy",
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit"
    };

    this.setupPresets();
  }

  enquiryStatus(event: any) {
    if (event._value == this.mandateSubType) {
      // Does nothing here...  due to click functionality, mat-radio-button was misbehaving. Hence.
    } else {
      this.mandateSubType = event._value;
      this.enquiryForm.controls["mandateSubType"].patchValue[event._value];
      this.reset("mandateSubTypeChange");
      this.showGrid = false;
      this.enquiryForm.reset();
      this.enquiryForm.value.mandateReportGrid = this.mandateReportGrid = [];
      this.enquiryForm.value.mandateSubType = event._value;

      this.lookupService.getLookup("MANDATES_TYPE").subscribe((data: any) => {
        this.mandateTypes = data.data;
      });

      if (event._value == "ongoingmandates") {
        this.lookupService
          .getLookup("MANDDATE_QUEUES_STATUS")
          .subscribe((data: any) => {
            this.queueStatus = data.data;
          });
      } else {
        this.lookupService
          .getLookup("MANDATES_CONFIRMED_STATUS")
          .subscribe((data: any) => {
            this.queueStatus = data.data;
          });
      }
    }
  }

  download(downloadType) {
    this.reportObject.downloadType = downloadType;
    this.reportObject.dataFor = "download";
    this.reportService
      .getDataForGrid(this.reportObject)
      .subscribe((response: any) => {
        this.fileName = response.data.fileName;
        this.reportService.downloadFile(this.fileName).subscribe(data => {
          saveAs(data, this.fileName);
        });
      });
  }

  enquiry(enquiryForm) {
    this.enquiryClicked = true;
    if (
      this.enquiryForm.value.mandateType === undefined ||
      this.enquiryForm.value.mandateType === null
    ) {
      this.noRecords = true;
    } else {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.minRecords = 1;
      this.selected = 10;
      this.maxRecords = 10;
      this.reportObject = this.enquiryForm.value;
      this.reportObject.mandateSubType = this.mandateSubType;
      this.reportObject.amount = this.enquiryForm.value.amt;
      this.reportObject.achCode = this.enquiryForm.value.achCd;
      this.reportObject.payerAccountNumber = this.enquiryForm.value.payeeAccNumber;
      this.reportObject.mndRefNum = this.enquiryForm.value.mndRefNumber;
      if (this.queueStatusValue == undefined) {
        this.reportObject.queueStatus = "";
        this.reportObject.processStatus = "";
        if (this.enquiryForm.value.mandateSubType == "ongoingmandates") {
          this.reportObject.reportName = "MandateInProgressReport";
        } else {
          this.reportObject.reportName = "MandateConfirmedReport";
        }
      } else {
        if (this.enquiryForm.value.mandateSubType === "ongoingmandates") {
          this.reportObject.reportName = "MandateInProgressReport";
          this.reportObject.queueStatus = this.queueStatusValue.valueOne;
          this.reportObject.processStatus = "";
        } else {
          this.reportObject.reportName = "MandateConfirmedReport";
          this.reportObject.queueStatus = this.queueStatusValue.valueOne;
          this.reportObject.processStatus = this.queueStatusValue.valueTwo;
        }
      }
      this.reportObject.reportType = "MANDATE";
      this.reportObject.fromDate = this.datePipe.transform(
        this.range.fromDate,
        "dd-MM-yy"
      );
      this.reportObject.toDate = this.datePipe.transform(
        this.range.toDate,
        "dd-MM-yy"
      );
      this.reportObject.dataFor = "grid";
      this.fetchDataForGrid(this.maxRecords, this.minRecords);
    }
  }

  fetchDataForGrid(max, min) {
    var gridData = [];
    this.reportObject.max = max;
    this.reportObject.min = min;
    this.reportService
      .getDataForGrid(this.reportObject)
      .subscribe((response: any) => {
        this.tableHeader = response.data.header.slice(0, 17);
        this.totalRecords = response.data.count;
        this.mandateReportGrid = [];

        var paymentReport = [];
        gridData = response.data.data;

        response.data.data.forEach(element => {
          element.splice(0, 1);
          if (this.mandateSubType != "ongoingmandates") {
            switch (element[17]) {
              case "0":
                element[11] = "ACTIVE";
                break;
              case "2":
                element[11] = "EXPIRED";
                break;
              case "4":
                element[11] = "CANCELLED";
                break;
            }
          } else {
            this.queueStatus.forEach(data1 => {
              if (element[11] == data1.valueOne) {
                element[11] = data1.value;
              }
            });
          }
          this.mandateReportGrid.push(element);
        });

        if (
          this.mandateReportGrid !== null &&
          this.mandateReportGrid.length > 0
        ) {
          this.showGrid = true;
          this.noRecords = false;
        } else {
          this.noRecords = true;
          this.showGrid = false;
        }

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.totalRecords % this.pageSize === 0) {
          this.maxRecords = this.pageSize * this.pageNumber;
        } else {
          this.maxRecords =
            this.pageSize * (this.pageNumber - 1) + gridData.length;
        }
      });
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    this.fetchDataForGrid(this.maxRecords, this.minRecords);
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    this.fetchDataForGrid(this.maxRecords, this.minRecords);
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    if (this.pageNumber === this.totalPages) {
      this.maxRecords = this.totalRecords;
    } else {
      this.maxRecords = this.pageSize * this.pageNumber;
    }
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    this.fetchDataForGrid(this.maxRecords, this.minRecords);
  }

  viewReportSummary(summaryForm) {
    this.totalCount=0;
    if(this.mandateTypeSummary==="ongoingmandates"){
      this.queueNameService.getQueueName("UPLD", "MANDATE");
      this.queueNameService.queueSubject.subscribe((data: any) => {
        this.queueNames = data;
      });
    }
    else{
      this.queueNameService.getQueueName("CFRM", "MANDATE");
      this.queueNameService.queueSubject.subscribe((data: any) => {
        this.queueNames = data;
      });
    }
    
      // this.totalCount = 0;
      this.disableSubmit=true;
    
    let reportSendObject = new ReportObject();
    reportSendObject.reportType = "MANDATE";
    reportSendObject.mandateSubType = this.mandateTypeSummary;
    reportSendObject.mandateType = summaryForm.paperEmandate;
    reportSendObject.fileName = summaryForm.summaryFileName;
    reportSendObject.achCode = summaryForm.summaryUtilityCode;
    reportSendObject.dataFor="grid";
    reportSendObject.fromDate = this.datePipe.transform(
      this.range.fromDate,
      "yyyy-MM-dd"
    );
    reportSendObject.toDate = this.datePipe.transform(
      this.range.toDate,
      "yyyy-MM-dd"
    );

    this.summaryReportService
      .getPaymentSummaryReport(reportSendObject)
      .subscribe((data: any) => {
        this.getQueueNameToShow(data.data);
        this.disableSubmit=false;
        data.data.forEach(element => {
          console.log("element.COUNT",element.COUNT);
          this.totalCount = this.totalCount + element.COUNT;
          console.log("this.totalCount",this.totalCount);
        });
      });
  }

  getQueueNameToShow(dataArray: any): any {
    let assignObject = [];
    // if (this.mandateTypeSummary !== "confirmed") {
      dataArray.forEach(gridData => {
        this.queueNames.forEach(element => {
          console.log("element",element.queueCode);
          if (element.queueCode === gridData.QUEUECODE) {
            gridData.QUEUECODE = element.queueDescription;
          }
        });
        assignObject.push(gridData);
      });
      this.summaryReportData = assignObject;
    // } 
  }

  downoladSummaryViewReport(summaryForm) {
    let reportSendObject = new ReportObject();
    reportSendObject.reportType = "MANDATE";
    reportSendObject.mandateSubType = this.mandateTypeSummary;
    reportSendObject.mandateType = summaryForm.paperEmandate;
    reportSendObject.fileName = summaryForm.summaryFileName;
    reportSendObject.achCode = summaryForm.summaryUtilityCode;
    reportSendObject.fromDate = this.datePipe.transform(
      this.range.fromDate,
      "yyyy-MM-dd"
    );
    reportSendObject.toDate = this.datePipe.transform(
      this.range.toDate,
      "yyyy-MM-dd"
    );

    reportSendObject.dataFor="download";
    this.summaryReportService
      .getPaymentSummaryReport(reportSendObject)
      .subscribe((data: any) => {
        let fileX = data.data;
        this.reportService.downloadFile(fileX).subscribe(data => {
          saveAs(data, fileX);
        });
      });
  }

  sortGrid(index) {
    this.sortClicked = !this.sortClicked;
    if (this.sortClicked) {
      this.sortingService
        .sortGrid(index, this.mandateReportGrid, "asc")
        .subscribe(data => {
          this.mandateReportGrid = data;
        });
    } else {
      this.sortingService
        .sortGrid(index, this.mandateReportGrid, "desc")
        .subscribe(data => {
          this.mandateReportGrid = data;
        });
    }
  }
}

export class ReportObject {
  downloadType: any;
  reportName: any;
  reportType: any;
  paymentType: any;
  mandateType: any;
  mandateSubType: any;
  umrn: any;
  amount: any;
  payerAccountNumber: any;
  achCode: any;
  fromDate: any;
  toDate: any;
  txnRefNum: any;
  mndRefNum: any;
  fileName: any;
  queueStatus: any;
  processStatus: any;
  max: any;
  min: any;
  dataFor: any;
}
