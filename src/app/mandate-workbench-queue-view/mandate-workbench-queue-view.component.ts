import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkBenchService } from "../services/mandate/workbench/workbench-service";
import { ConfigService } from "../services/config/config-service";

@Component({
  selector: "app-mandate-workbench-queue-view",
  templateUrl: "./mandate-workbench-queue-view.component.html",
  styleUrls: ["./mandate-workbench-queue-view.component.scss"]
})
export class MandateWorkbenchQueueViewComponent implements OnInit {
  mandateQueueHeader: any = [];
  mandateQueueUploadData: any = [];
  resultRangeValue: any = [];
  selected: any = [];
  selectedresultRangeValue: any;
  gridsearch: any;
  qCode: any;
  qDesc: any;
  qCount: number;
  showingRows: number = 10;
  selecteVal: number = 10;
  startRow: number = 1;
  mandateObj: any[];
  dateFormat: any;

  pagination = {
    currPage: 1,
    pageSize: 10,
    totalPages: 0
  };

  previousDisabled: boolean = true;
  nextDisabled: boolean;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workBenchService: WorkBenchService,
    private configServc: ConfigService
  ) {
    this.dateFormat = configServc.getDateTimeFormat();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.qCode = params["qCode"];
      this.qDesc = params["qDesc"];
      this.qCount = params["qCount"];
    });

    this.fetchDataOnSelectedCorpQue();
    this.mandateQueueHeader = [
      "Mandate Reference ID",
      // "Request Type",
      "Mandate Type",
      "Amount",
      "Account Number",
      "Payee Bank Code",
      "Created By",
      "Created Date and Time"
    ];

    this.resultRangeValue = [
      {
        value: 5,
        viewValue: 5
      },
      {
        value: 10,
        viewValue: 10
      },
      {
        value: 15,
        viewValue: 15
      },
      {
        value: 20,
        viewValue: 20
      }
    ];

    this.selected = "10";
  }

  fetchDataOnSelectedCorpQue() {
    this.route.params.subscribe(params => {
      this.qCode = params["qCode"];
      this.qDesc = params["qDesc"];
      this.qCount = params["qCount"];
    });
    this.searchObj.queueCode = this.qCode;
    this.searchObj.currPage = this.pagination.currPage - 1;
    if (this.qCount < this.pagination.pageSize) {
      this.showingRows = this.qCount;
    }
    this.workBenchService
      .getMandatesOnQueStatus(this.searchObj)
      .subscribe((resp: any) => {
        this.mandateObj = resp.data.content;
      });
    this.pagination.totalPages = Math.ceil(this.qCount / this.selecteVal);
  }

  fetchDataOnGridSearch() {
    this.searchObj.queueCode = this.qCode;
    this.searchObj.currPage = this.pagination.currPage - 1;
    this.workBenchService
      .getMandatesOnGridSearch(this.searchObj)
      .subscribe((resp: any) => {
        this.mandateObj = resp.data.content;
      });
    this.workBenchService
      .getMandateCountForGrid(this.searchObj)
      .subscribe((data: any) => {
        this.qCount = data.data;
      });
    this.pagination.totalPages = Math.ceil(this.qCount / this.selecteVal);
  }

  viewMandate(mndRefNo,qcode) {
    if(qcode==="PVE-300")
    {
      this.router.navigate(["reapairmandate", { mndRefNum: mndRefNo }]);

    }
    else
    {
      this.router.navigate(["viewmandate", { mndRefNum: mndRefNo }]);

    }
  }

  gridsearchTable(event) {
    this.fetchDataOnGridSearch();
  }

  pageChanged(event) {
    this.paginationReset();
    this.selecteVal = event.target.value;
    this.showingRows = event.target.value;
    this.pagination.pageSize = event.target.value;

    if (this.showingRows * 1 > this.qCount * 1) {
      this.showingRows = this.qCount;
    } else {
      this.showingRows = event.target.value;
    }
    this.searchObj.pageSize = this.showingRows;
    if (this.gridsearch) {
      this.fetchDataOnGridSearch();
    } else {
      this.fetchDataOnSelectedCorpQue();
    }

    if (this.pagination.totalPages * 1 <= 1) {
      this.nextDisabled = true;
    }
    if (this.showingRows * 1 < this.qCount) {
      this.nextDisabled = false;
    }
  }
  paginationReset() {
    this.pagination.currPage = 1;
    this.pagination.pageSize = 0;
    this.pagination.totalPages = 0;
    this.startRow = 1;
    this.showingRows = this.selecteVal;
    this.previousDisabled = true;
    this.nextDisabled = false;
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

  previousButtonClicked(event) {
    this.pagination.currPage = this.pagination.currPage - 1;
    this.buttonStatus();
    this.nextDisabled = false;
    this.startRow = this.startRow * 1 - this.selecteVal * 1;
    this.showingRows = this.pagination.currPage * this.selecteVal;
    if (this.startRow * 1 === 0) {
      this.startRow = 1 * 1;
    }

    if (this.gridsearch) {
      this.fetchDataOnGridSearch();
    } else {
      this.fetchDataOnSelectedCorpQue();
    }
  }

  nextButtonClicked(event) {
    this.pagination.currPage = this.pagination.currPage + 1;
    this.buttonStatus();
    this.startRow = this.showingRows * 1 + 1;
    if (this.startRow * 1 + (this.pagination.pageSize - 1) < this.qCount) {
      this.showingRows = this.startRow * 1 + (this.pagination.pageSize - 1);
    } else {
      this.showingRows = this.qCount;
    }

    if (this.gridsearch) {
      this.fetchDataOnGridSearch();
    } else {
      this.fetchDataOnSelectedCorpQue();
    }
  }
}
