import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from '../services/fileupload/uploadservice';
import { WorkBenchService } from '../services/mandate/workbench/workbench-service';
import { MandateFileSearchService } from '../services/gridsearchservices/mandate-file-summary-service';
import { PopupService } from '../popup.service';
import { AuthenticationService } from '../services/authentication/login/login.service';

@Component({
  selector: 'app-payment-uploaded-grid',
  templateUrl: './payment-uploaded-grid.component.html',
  styleUrls: ['./payment-uploaded-grid.component.scss']
})
export class PaymentUploadedGridComponent implements OnInit {
  //word split
  getSplitWord = function (item) {
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


  @ViewChild('tablescroll', { read: ElementRef }) public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }
  chosenValue = "OffUs";
  paymentUploadOnUsHeader: any;
  paymentUploadHeader: any;
  paymentUploadFileData: any;
  selected: any;
  selectedresultRangeValue: any;
  gridsearch: boolean = false;
  pageNumber: any;
  pageSize: any;
  sortClicked: boolean = false;
  totalRecords: any;
  totalPages: any;
  fileName: any;
  doesGridDataExistForSearch: boolean = true;
  doesGridDataExist: boolean = true;
  maxRecords: any;
  minRecords: any;
  noRecords: boolean = false;
  msg: any;
  successMsg: any
  msgType: any
  userRole: any;

  //NewAdditionsForPaymentAuthorization
  selectAllValue = false;
  selectedPaymentFiles: any[] = [];
  fileNames: String[] = [];

  resultRangeValue = [
    { value: "5", viewValue: "5" },
    { value: "10", viewValue: "10" },
    { value: "15", viewValue: "15" },
    { value: "20", viewValue: "20" }];

  constructor(private uploadService: UploadService,
    private workBenchService: WorkBenchService,
    private searchService: MandateFileSearchService, private router: Router,
    private popupService: PopupService,
    private authService: AuthenticationService, ) { }




  ngOnInit() {
    this.userRole = this.authService.loggedInUser.role.roleType;
    this.pageNumber = 1;
    this.maxRecords = this.pageSize = 10;
    this.minRecords = 1;
    this.selectedresultRangeValue = 10;
    const uploadSearch = new UploadSearch();
    this.initializeUploadSearch(uploadSearch);
    uploadSearch.queryType = 'PAYMENT';
    this.uploadService.getUploadCountStatus(uploadSearch).subscribe((data) => {
      this.totalRecords = data;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      if (this.totalRecords % this.pageSize === 0) {
        this.maxRecords = this.pageSize * this.pageNumber;
      } else if (this.totalRecords / this.pageSize >= 1) {
        this.maxRecords = this.pageSize;
      }
      else {
        this.maxRecords = this.totalRecords;
      }
    });
    this.paymentUploadHeader = ["Bulk File Name", "Exception", "Pending Release", "Remove from Releasing", "Released to Sponsor Bank", "Presented to Clearing house", "Rejected by Clearing house", "Send to Destination bank", "Settled", "Returned", "Bank Extension"];
    console.log("above fetch data for grid()");
    this.fetchDataforGrid(this.maxRecords, this.minRecords);
    this.paymentUploadOnUsHeader = ["Bulk File Name", "Exception", "Pending Authorization", "Manual Intervention", "Settled", "Returned"];
  }

  fetchDataforGrid(maxRecrds, minRecrds) {
    console.log("entering fetchDataforGrid");

    this.doesGridDataExistForSearch = true;
    this.doesGridDataExistForSearch = true;
    if (this.chosenValue === 'OffUs') {
      this.uploadService.getUploadQueueStatus(maxRecrds, minRecrds, 'PAYMENT').subscribe((resp: any) => {
        console.log("RESP", JSON.stringify(resp, null, 2));
        this.paymentUploadFileData = resp.data;
        if (resp.data == null) {
          this.doesGridDataExist = false;
          this.noRecords = true;
        } else {
          this.doesGridDataExistForSearch = true;
          this.doesGridDataExist = true;
          this.noRecords = false;
        }
      },
        err => {
          console.log(`Error on fetching UploadStatus ${JSON.stringify(err)}`);
        });
    }
    else {
      this.uploadService.getUploadQueueStatusForOnUs(maxRecrds, minRecrds, 'PAYMENT', 'OnUs').subscribe((resp: any) => {
        console.log("ONUS---", JSON.stringify(resp, null, 2));
        this.paymentUploadFileData = resp.data;
        if (resp.data == null) {
          this.doesGridDataExist = false;
          this.noRecords = true;
        } else {
          this.doesGridDataExistForSearch = true;
          this.doesGridDataExist = true;
          this.noRecords = false;
        }
      },
        err => {
          console.log(`Error on fetching UploadStatus ${JSON.stringify(err)}`);
        });
    }
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    if (this.gridsearch) {
      this.gridSearchFunction(this.fileName);
    } else {
      this.fetchDataforGrid(this.maxRecords, this.minRecords);
    }
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = ((this.pageNumber - 1) * this.pageSize) + 1;
    if (this.gridsearch) {
      this.gridSearchFunction(this.fileName);
    } else {
      this.fetchDataforGrid(this.maxRecords, this.minRecords);
    }
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    if (this.pageNumber === this.totalPages) {
      this.maxRecords = this.totalRecords;
    }
    else {
      this.maxRecords = this.pageSize * this.pageNumber;
    }
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    if (this.gridsearch) {
      this.gridSearchFunction(this.fileName);
    } else {
      this.fetchDataforGrid(this.maxRecords, this.minRecords);
    }
  }


  gridSearchFunction(fileName) {
    let searchObject: PaymentFileSearchObj = new PaymentFileSearchObj();
    searchObject.fileName = fileName;
    searchObject.max = this.maxRecords;
    searchObject.min = this.minRecords;
    searchObject.messageType = "PAYMENT";

    this.searchService.fileGridSearch(searchObject).subscribe((data: any) => {
      this.paymentUploadFileData = data.data;
    });
    this.searchService.fileGridSearchCount(searchObject).subscribe((data: any) => {
      this.totalRecords = data.data;
      if (data.data == 0) {
        this.doesGridDataExistForSearch = false;
        this.noRecords = true;
      } else {
        this.doesGridDataExistForSearch = true;
        this.noRecords = false;
      }
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      if (this.totalRecords % this.pageSize === 0) {
        this.maxRecords = this.pageSize * this.pageNumber;
      }
      else {
        this.maxRecords = (this.pageSize * (this.pageNumber - 1) + this.paymentUploadFileData.length);
      }
    });

  }



  initializeUploadSearch(uploadSearch) {
    uploadSearch.fromDate = '';
    uploadSearch.toDate = '';
    uploadSearch.queryType = '';
    uploadSearch.max = '';
    uploadSearch.min = '';
    uploadSearch.uploadedFileName = '';
    uploadSearch.fileProcessingStatus = '';
    uploadSearch.fileType = '';
  }


  //NewAdditionsForPaymentAuthorization

  selectAll() {
    this.selectedPaymentFiles = [];
    if (this.selectAllValue) {
      this.selectedPaymentFiles.push(this.paymentUploadFileData);

      this.selectedPaymentFiles.forEach(element => {
        this.fileNames.push(element.BATCH_FILE_NAME);

      });


    } else {
      //handle when user deselects selectAll checkbox
    }

  }

  selectOne(index, selectStatus) {
    if (selectStatus) {
      this.selectedPaymentFiles.push(this.paymentUploadFileData[index]);
      // console.log(JSON.stringify( this.selectedPaymentFiles[0][0]));
      this.fileNames.push(this.selectedPaymentFiles[0].BATCH_FILE_NAME);
    } else {
      //handle the splice here once the api is ready
    }
  }

  release() {
    if (this.paymentUploadFileData.length > 0) {
      this.searchService.authBulkPayment(this.fileNames, "ACC").subscribe((data: any) => {
        console.log(JSON.stringify(data));
        this.msg = "Selected " + this.fileNames.length + " Files Released to Sponser Bank";
        this.successMsg = "RELEASED";
        this.msgType = "SUCCESS";

        this.popupService.mandateSubmit(this.msg, this.successMsg, this.msgType).subscribe((status) => {
          console.log("successStatus=", status);
          //this.ImageUrl="";
          this.ngOnInit();
        })
      });
    }


  }

  remove() {
    if (this.paymentUploadFileData.length > 0) {
      this.searchService.authBulkPayment(this.fileNames, "REJ").subscribe((data: any) => {
        console.log(JSON.stringify(data));

        this.msg = "Selected " + this.fileNames.length + " Files Released to Exception";
        this.successMsg = "REMOVED";
        this.msgType = "SUCCESS";

        this.popupService.mandateSubmit(this.msg, this.successMsg, this.msgType).subscribe((status) => {
          console.log("successStatus=", status);
          //this.ImageUrl="";
          this.ngOnInit();
        })
      });
    }
  }

  view(file, count, queueStatus) {
    this.router.navigate(['paymentTransaction', { fileName: file, count: count, qstatus:queueStatus }]);
  }


  onUsorOffUs(event: any) {
    this.ngOnInit();
  }

}


export class UploadSearch {
  max: string;
  min: string;
  queryType: string;
  fileType: string;
  uploadedFileName: string;
  fromDate: string;
  toDate: string;
  fileProcessingStatus: string;
}

export class PaymentFileSearchObj {
  fileName: string;
  max: any;
  min: any;
  messageType: any;
}

