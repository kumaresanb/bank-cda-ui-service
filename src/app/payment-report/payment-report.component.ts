import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  NgxDrpOptions,
  PresetItem,
  Range,
  RangeStoreService
} from "ngx-mat-daterange-picker";
import { ConfigService } from "../services/config/config-service";
import { FormGroup, FormControl } from "@angular/forms";
import { LookupService } from "../services/lookupservice/plf-lookup-service";
import { PaymentEnquiryService } from "../services/payment/payment-enquiry-service";
import { DatePipe } from "@angular/common";
import { ReportService } from "../services/report/report-service";
import { saveAs } from "file-saver";
import { SortingService } from "../services/sortingservice/sorting-service";
import { SummaryReportService } from "../services/summary-report-service/SummaryReportService";
import { QueueNameService } from "../shared/queue-name-service";

@Component({
  selector: "app-payment-report",
  templateUrl: "./payment-report.component.html",
  styleUrls: ["./payment-report.component.scss"]
})
export class PaymentReportComponent implements OnInit {
  report: any;

  dateTimeFormat: any;
  dateFormat: any;

  paymentReportForm: FormGroup;
  paymentSummaryReportForm: FormGroup;
  paymentTyp: any;
  queueStat: any;
  showGrid: any;
  noRecords: any;
  pageNumber: any;
  pageSize: any;
  min: any;
  max: any;
  totalRecords: any;
  totalPages: any;
  invalidDateRange: boolean = false;
  reportObject: ReportObject;
  fileName: any;
  sortClicked: boolean = false;
  disableSubmit:boolean=false;

  showHide: any = [];
  showHide1: any = [];
  resultRangeValue: any;
  tableHeader: any = [];
  selected: any;
  paymentReportGrid: any = [];
  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  gridsearch: any;
  futureDateSelected: boolean = false;

  summaryReportData: any;
  queueNames: any=[];
  totalAmount: number;
  totalCount: number;

  @ViewChild("tablescroll", { read: ElementRef })
  public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({
      left: this.tablescroll.nativeElement.scrollLeft + 470,
      behavior: "smooth"
    });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({
      left: this.tablescroll.nativeElement.scrollLeft - 470,
      behavior: "smooth"
    });
  }

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
    private configService: ConfigService,
    private lookupService: LookupService,
    private reportService: ReportService,
    private datePipe: DatePipe,
    private rangeStoreService: RangeStoreService,
    private sortingService: SortingService,
    private summaryPaymentService: SummaryReportService,
    private queueNameService: QueueNameService
  ) {}

  reset() {
    this.paymentReportForm.reset();
    this.invalidDateRange = false;
    this.futureDateSelected = false;
    this.paymentReportGrid = [];
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
  ngOnInit() {
    this.report = "Detailed Report";
    this.dateTimeFormat = this.configService.getDateTimeFormat();
    this.dateFormat = this.configService.getDateFormat();

    

    this.paymentReportForm = new FormGroup({
      paymentType: new FormControl(),
      umrn: new FormControl(),
      amount: new FormControl(),
      payerAccountNumber: new FormControl(),
      achCode: new FormControl(),
      txnRefNum: new FormControl(),
      fileName: new FormControl(),
      queueStatus: new FormControl()
    });

    this.paymentSummaryReportForm = new FormGroup({
      sumPaymentType: new FormControl(""),
      sumPayUtilityCode: new FormControl(""),
      sumPayFileName: new FormControl(""),
      sumPayUMRN: new FormControl("")
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
    this.selected = "10";
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

  viewSummaryReportFormSubmit(summaryForm) {
      this.totalAmount = 0;
      this.totalCount = 0;
      this.disableSubmit=true;
      let reportSendObject = new ReportObject();
      reportSendObject.paymentType = summaryForm.sumPaymentType;
      reportSendObject.achCode = summaryForm.sumPayUtilityCode;
      reportSendObject.fileName = summaryForm.sumPayFileName;
      reportSendObject.umrn = summaryForm.sumPayUMRN;
      reportSendObject.dataFor = "grid";
      reportSendObject.reportType = "PAYMENT";
  
      reportSendObject.fromDate = this.datePipe.transform(
        this.range.fromDate,
        "yyyy-MM-dd"
      );
      reportSendObject.toDate = this.datePipe.transform(
        this.range.toDate,
        "yyyy-MM-dd"
      );
      this.queueNameService.getQueueName("UPLD", "PAYMENT");
      this.queueNameService.queueSubject.subscribe((data: any) => {
        this.queueNames = data;
      });
  
      this.summaryPaymentService
        .getPaymentSummaryReport(reportSendObject)
        .subscribe((data: any) => {
          this.disableSubmit=false;
          //this.summaryReportData = data.data;
          this.getQueueNameToShow(data.data);
          data.data.forEach(element => {
            this.totalAmount = this.totalAmount  + element.AMOUNT;
            
            this.totalCount = this.totalCount  + element.COUNT;
          });
        });
    
  }

  getQueueNameToShow(dataArray: any): any {
    let assignObject = [];
    dataArray.forEach(gridData => {
      this.queueNames.forEach(element => {
        if (element.queueCode === gridData.QUEUECODE) {
          gridData.QUEUECODE = element.queueDescription;
        }
      });
      assignObject.push(gridData);
    });
    this.summaryReportData = assignObject;
  }

  downoladSummaryViewReport(summaryForm) {
    let reportSendObject = new ReportObject();
    reportSendObject.reportType = "PAYMENT";
    reportSendObject.paymentType = summaryForm.sumPaymentType;
    reportSendObject.fileName = summaryForm.sumPayFileName;
    reportSendObject.achCode = summaryForm.sumPayUtilityCode;
    reportSendObject.umrn = summaryForm.sumPayUMRN;
    reportSendObject.fromDate = this.datePipe.transform(
      this.range.fromDate,
      "yyyy-MM-dd"
    );
    reportSendObject.toDate = this.datePipe.transform(
      this.range.toDate,
      "yyyy-MM-dd"
    );

    reportSendObject.dataFor = "download";
    this.summaryPaymentService
      .getPaymentSummaryReport(reportSendObject)
      .subscribe((data: any) => {
        let fileX = data.data;
        this.reportService.downloadFile(fileX).subscribe(data => {
          saveAs(data, fileX);
        });
      });
  }

  viewReportFormSubmit(formDetails) {
    this.showGrid = false;
    if (
      this.paymentReportForm.value.paymentType === undefined ||
      this.paymentReportForm.value.paymentType === null
    ) {
      this.noRecords = true;
    } else {
      this.pageNumber = 1;
      this.pageSize = 10;
      this.min = 1;
      this.selected = 10;
      this.max = 10;
      this.reportObject = this.paymentReportForm.value;
      this.reportObject.reportName = "PAYMENT";
      this.reportObject.reportType = "PAYMENT";
      this.reportObject.dataFor = "grid";

      this.reportObject.fromDate = this.datePipe.transform(
        this.range.fromDate,
        "dd-MM-yy"
      );
      this.reportObject.toDate = this.datePipe.transform(
        this.range.toDate,
        "dd-MM-yy"
      );
      this.reportObject.max = 10;
      this.reportObject.min = 1;
      this.reportObject.dataFor = "grid";
      this.fetchDataForGrid(this.max, this.min);
    }
  }

  fetchDataForGrid(max, min) {
    var gridData = [];
    this.reportObject.max = max;
    this.reportObject.min = min;
    this.reportService
      .getDataForGrid(this.reportObject)
      .subscribe((response: any) => {
        this.paymentReportGrid = [];
        this.tableHeader = response.data.header;
        this.totalRecords = response.data.count;
        var paymentReport = [];
        gridData = response.data.data;
        gridData.forEach(element => {
          element.splice(0, 1);
          this.queueStat.forEach(data1 => {
            if (element[8] == data1.valueOne) {
              element[8] = data1.value;
            }
          });
          this.paymentReportGrid.push(element);
        });

        if (
          this.paymentReportGrid !== null &&
          this.paymentReportGrid.length > 0
        ) {
          this.showGrid = true;
          this.noRecords = false;
        } else {
          this.noRecords = true;
          this.showGrid = false;
        }

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        if (this.totalRecords % this.pageSize === 0) {
          this.max = this.pageSize * this.pageNumber;
        } else {
          this.max = this.pageSize * (this.pageNumber - 1) + gridData.length;
        }
      });
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.max = this.pageNumber * event.target.value;
    this.min = 1;
    this.fetchDataForGrid(this.max, this.min);
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.min = (this.pageNumber - 1) * this.pageSize + 1;
    this.max = this.pageNumber * this.pageSize;
    this.fetchDataForGrid(this.max, this.min);
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    if (this.pageNumber == this.totalPages) {
      this.max = this.totalRecords;
    } else {
      this.max = this.pageSize * this.pageNumber;
    }
    this.min = (this.pageNumber - 1) * this.pageSize + 1;
    this.fetchDataForGrid(this.max, this.min);
  }

  sortGrid(index) {
    this.sortClicked = !this.sortClicked;
    if (this.sortClicked) {
      this.sortingService
        .sortGrid(index, this.paymentReportGrid, "asc")
        .subscribe(data => {
          this.paymentReportGrid = data;
        });
    } else {
      this.sortingService
        .sortGrid(index, this.paymentReportGrid, "dsc")
        .subscribe(data => {
          this.paymentReportGrid = data;
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
