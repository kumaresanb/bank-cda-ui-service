import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PaymentFileSummaryService } from "../services/payment/paymentfilesummaryserivce";

@Component({
  selector: "app-payment-transaction-list",
  templateUrl: "./payment-transaction-list.component.html",
  styleUrls: ["./payment-transaction-list.component.scss"]
})
export class PaymentTransactionListComponent implements OnInit {
  gridsearch: any;
  onTabChanged: any;

  fileName: any;
  pageSize: any = 10;
  currentPage: any;
  totalCount: any;
  pageStart: any;
  pageEnd: any;
  totalPages: any;
  previousDisabled: boolean = false;
  nextDisabled: boolean = false;
  queStatus:any;

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

  paymentTransactionHeader: any = [];
  paymentTxnGridData: any = [];
  resultRangeValue = [
    { value: "5", viewValue: "5" },
    { value: "10", viewValue: "10" },
    { value: "15", viewValue: "15" },
    { value: "20", viewValue: "20" }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private paymentFileSummaryService: PaymentFileSummaryService
  ) {
    this.route.params.subscribe((data: any) => {
      this.fileName = data.fileName;
      this.totalCount = data.count;
      this.queStatus = data.qstatus;

    });
  }

  ngOnInit() {
    this.currentPage = 0;
    this.pageSize = 10;
    this.paymentTxnGridData = [];
    this.fetchData();
    this.pageStart = 1;
    this.pageEnd = this.paymentTxnGridData.length;
    this.nextDisabled = false;
    this.previousDisabled=false;

    this.paymentTransactionHeader = [
      "Transaction Reference",
      "UMRN",
      "ACH Code",
      "Amount",
      "Receiving Bank Code",
      "Receiving Account Number"
    ];
  }

  pageSizeChanged(event) {
    this.pageSize = event.target.value;
    this.pageStart = 1;
    this.currentPage = 0*0;
    this.nextDisabled = false;
    this.previousDisabled=true;
    this.fetchData();
  }

  nextClicked() {
    this.pageStart = this.pageEnd * 1 + 1;
    this.currentPage = this.currentPage * 1 + 1;
    this.fetchData();
    if ((this.currentPage*1 + 1) == this.totalPages) {
      this.nextDisabled = true;
      this.previousDisabled=false;
    }
  }

  previousClicked() {
    this.currentPage =
      (this.currentPage * 1 )- 2 >= 0 ? (this.currentPage * 1) - 2 : 0;
    this.pageStart = this.currentPage * this.pageSize + 1;
    this.fetchData();
    if (this.pageStart==1) {
      this.previousDisabled = true;
      this.nextDisabled=false;
    }
  }

  navigateBack() {
    // var lastUrlEndIndex = this.router.url.indexOf("viewTransaction");
    this.router.navigate(["paymentuploadgrid"]);
  }

  viewTransaction(data) {
    this.router.navigate(["viewTransaction",{data:JSON.stringify(data), count:this.totalCount}]);
  }

  fetchData() {
    this.paymentFileSummaryService
      .getDataByFileName(this.fileName, this.pageSize, this.currentPage, this.queStatus)
      .subscribe((data: any) => {
        this.paymentTxnGridData = data.data.content;
        this.pageEnd =
          (this.currentPage * 1 + 1) * this.paymentTxnGridData.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      });
      if ((this.pageEnd*1) == (this.totalCount*1)) {
        this.nextDisabled = true;
        this.previousDisabled=false;
      }
      else{
        this.nextDisabled = false;
        this.previousDisabled=true;
      }
  }
}
