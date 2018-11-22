import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadSuccessPopupComponent } from '../upload-success-popup/upload-success-popup.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UploadService } from '../services/fileupload/uploadservice';
import { PopupService } from '../popup.service';
import { SortingService } from './../services/sortingservice/sorting-service';
import { LookupService } from '../services/lookupservice/plf-lookup-service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from '../services/authentication/login/login.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigService } from '../services/config/config-service';
import { saveAs } from "file-saver";
import { BulkUploadDialogComponent } from '../bulk-upload-dialog/bulk-upload-dialog.component';
import { debug } from 'util';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  tableHeader: any = [];
  mandateUploadHeader: any = [];
  mandateUploadFileData: any = [];
  selectedmessageType: any = [];
  selectedcategory: any = [];
  paymentScheme: any = [];
  messageType: any = [];
  category: any = [];
  fileName: any;
  fileToSave: File;
  fileTypeAllowed: any;
  maxFileSize: any;
  gridsearch: any;
  item1: any;
  item2: any;
  uploadForm: FormGroup;
  noRecords = false;

  searchFiletype: string;
  searchBatchRef: string;
  searchFileName: string;
  searchDate: string;
  searchUploadedBy: string;
  searchFileProcessingStatus: string;
  searchErrorFileName: string;

  dateTimeFormat: any;


  pageNumber: any;
  pageSize: any;
  maxRecords: any;
  minRecords: any;
  totalPages: any;
  totalRecords: any;
  showGrid: boolean;
  doesGridDataExistForSearch: boolean = true;
  sortClicked: any;
  selectedUtilityCode:any;

  bulkUploadMenus: any;

  upload_disable: boolean=false;

  tenantId: any;


  @ViewChild('tablescroll', { read: ElementRef }) public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }



  selectedresultRangeValue: any;
  resultRangeValue = [
    { value: '5', viewValue: '5' },
    { value: '10', viewValue: '10' },
    { value: '15', viewValue: '15' },
    { value: '20', viewValue: '20' }
  ];

  constructor(public dialog: MatDialog,
    private uploadService: UploadService,
    public snackBar: MatSnackBar,
    private popupService: PopupService,
    private sortingService: SortingService,
    private lookupCodeService: LookupService,
    public datepipe: DatePipe,
    private configService: ConfigService,
    private authService: AuthenticationService) { }


  selectedFileType(selected) {
    this.selectedmessageType = selected.value;
    console.log(this.selectedmessageType);
    this.fileTypeAllowed = this.selectedmessageType.valueTwo;
    this.maxFileSize = this.selectedmessageType.valueFour * 1000000;
  }

  openDialog(): void {
    this.tenantId=this.authService.loggedInUser.tenantId;

    if(this.selectedmessageType.valueOne=='Import ORGDR Payment'){
   
      this.uploadService.getUtilityCode(this.tenantId).subscribe(data => {
        const dialogRef = this.dialog.open(BulkUploadDialogComponent, {
          data:data,
          width: '250px',
        });
        dialogRef.afterClosed().subscribe(result => {
          this.selectedUtilityCode=result;
        });

      });
    }
  
  }

  uploadfile(event) {
    this.fileName = event.target.files[0].name;
    this.fileToSave = event.target.files[0];
    var selectedFileFormat = this.fileName.substring(
      this.fileName.lastIndexOf(".") + 1
    );
    if (this.selectedmessageType.valueOne === undefined) {
      this.fileName = "";
      this.saveButtonClick('please select a file type');
    }
    else if (selectedFileFormat != this.fileTypeAllowed && this.selectedmessageType.valueOne !== undefined) {
      var msg = `Please Upload file with ${this.fileTypeAllowed} extension and required format.`;
      var successMsg = "ERROR";
      var msgType = "FAILED"
      this.uploadForm.reset();
      this.fileName = "";
      this.fileToSave = undefined;
      this.selectedmessageType = [];
      this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status) => {
      });
    }
    /** Comparing the file size in bytes */
    else if (this.fileToSave.size > this.maxFileSize) {
      var msg = `File Size exceeds the limit.`;
      var successMsg = "ERROR";
      var msgType = "FAILED"
      // this.uploadForm.reset();
      this.ngOnInit();
      this.fileName = "";
      this.fileToSave = undefined;
      this.selectedmessageType = [];
      this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status) => {
      });
    }
  }

  download(fileName) {
    this.uploadService.downloadFile(fileName).subscribe(data => {
      saveAs(data, fileName);
    });
  }

  uploadSubmit() {
    this.upload_disable=!this.upload_disable;

    if (this.selectedmessageType.valueOne === undefined) {
      this.saveButtonClick('Please select a file type');
    }
    else if (this.fileToSave === undefined) {
      this.saveButtonClick('Please select a file to upload');
    }
    else {
      var selectedFileFormat = this.fileName.substring(
        this.fileName.lastIndexOf(".") + 1
      );
      if (selectedFileFormat != this.fileTypeAllowed && this.selectedmessageType.valueOne != undefined) {
        var msg = `Please Upload file with ${this.fileTypeAllowed} extension and required format.`;
        var successMsg = "ERROR";
        var msgType = "FAILED"
        // this.uploadForm.reset();
        this.ngOnInit();
        this.fileName = "";
        this.fileToSave = undefined;
        this.selectedmessageType = [];
        this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status) => {
        });
      }
      /** Comparing the file size in bytes */
      else if (this.fileToSave.size > this.maxFileSize) {
        var msg = `File Size exceeds the limit.`;
        var successMsg = "ERROR";
        var msgType = "FAILED"
        // this.uploadForm.reset();
        this.ngOnInit();
        this.fileName = "";
        this.fileToSave = undefined;
        this.selectedmessageType = [];
        this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status) => {
        });
      }
      this.uploadService.fileUpload(this.fileToSave, this.selectedmessageType.lookupCode, this.selectedmessageType.value).subscribe((data: any) => {
        var response = data.status;

        const dialogRef = this.dialog.open(UploadSuccessPopupComponent, {
        });
        setTimeout(() => {
          dialogRef.close();
        }, 2000);
        dialogRef.afterClosed().subscribe(result => {
          if (response === "DUPLICATE") {
            var msg = `'${this.fileName}' file name already exist in the application. Please upload the file with unique name.`;
            var successMsg = "ERROR";
            var msgType = "FAILED";
            // this.uploadForm.reset();
            this.fileName = "";
            this.fileToSave = undefined;
            this.selectedmessageType = [];
            this.ngOnInit();
            this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status: any) => {
            });
          }
          else if (response === "SUCCESS") {
            var msg = `'${this.fileName}' is successfully uploaded. Verification and Processing is In-progress. File with status will be updated in few minutes.`;
            var successMsg = "SUBMITTED";
            var msgType = "SUCCESS";
            this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status: any) => {
              this.selectedmessageType = [];
              this.fileName = "";
              this.fileToSave = undefined;
              this.ngOnInit();
              // this.uploadForm.reset();
            });
          }
          else {
            var msg = `'${this.fileName}' file is successfully uploaded. Verification and Processing is In-progress. File with status will be updated in few minutes.`;
            var successMsg = "SUBMITTED";
            var msgType = "SUCCESS";
            this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status: any) => {
              this.selectedmessageType = [];
              this.fileName = "";
              this.fileToSave = undefined;
              // this.uploadForm.reset();
              this.ngOnInit();
            });
          }
        });
      }, error => {
        var msg = `${this.fileName} is failed to upload.`;
        var successMsg = "ERROR";
        var msgType = "FAILED";
        this.fileName = "";
        this.fileToSave = undefined;
        this.selectedmessageType = [];
        // this.uploadForm.reset();
        this.ngOnInit();
        this.popupService.mandateSubmit(msg, successMsg, msgType).subscribe((status: any) => {
        });
      });
    }
  }

  saveButtonClick = (msg) => {
    let config = new MatSnackBarConfig();
    config.duration = 2000;
    config.panelClass = ['upload-err-popup']
    this.snackBar.open(`${msg}`, "Close", config);
  }

  fileTypeErr = () => {
    let config = new MatSnackBarConfig();
    config.duration = 2000;
    config.panelClass = ['upload-err-file-type-popup']
    this.snackBar.open('Select FIle Type', "Close", config);
  }

  uploadSuccessDialog(): void {
    const dialogRef = this.dialog.open(UploadSuccessPopupComponent, {
    });
    setTimeout(() => {
      dialogRef.close();
    }, 2000);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  //Word Split
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


  ngOnInit() {
    this.upload_disable=false;
    this.dateTimeFormat = this.configService.getDateTimeFormat();

    const menuGroup = this.authService.loggedInUser.role.menuGroup.filter(mg => mg.menuGroupCode === 'bulkmenugroup');
    this.bulkUploadMenus = menuGroup[0].menuItems.sort((menu1, menu2) => {
      return menu1.menuItemOrder - menu2.menuItemOrder;
    });

    this.uploadForm = new FormGroup({
      filetype: new FormControl(''),
      file: new FormControl('')
    });

    this.pageNumber = 1;
    this.maxRecords = this.pageSize = 10;
    this.minRecords = 1;
    this.selectedresultRangeValue = 10;

    const uploadSearch = new UploadSearch();
    this.initializeUploadSearch(uploadSearch);
    this.uploadService.getUploadCountForUploadGrid(uploadSearch).subscribe((data: any) => {
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


    this.lookupCodeService.getLookup("IMPORT_TYPE").subscribe((data: any) => {
      this.messageType = data.data;
    });
    this.uploadFileStatus(this.maxRecords, this.minRecords);
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    this.uploadFileStatus(this.maxRecords, this.minRecords);
  }

  previousClicked() {
    // alert("previous Clicked");
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = ((this.pageNumber - 1) * this.pageSize) + 1;
    this.uploadFileStatus(this.maxRecords, this.minRecords);
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    if (this.pageNumber === this.totalPages) {
      this.maxRecords = this.totalRecords;
    }
    else {
      this.maxRecords = this.pageSize * this.pageNumber;
    }
    this.minRecords = ((this.pageNumber - 1) * this.pageSize) + 1;
    this.uploadFileStatus(this.maxRecords, this.minRecords);
  }


  uploadFileStatus(maxCount, minCount) {
    this.reset();
    this.mandateUploadHeader = ["File type", "File Id", "Uploaded File Name", "Uploaded Date & Time", "Uploaded By", "File processing status", "Error file"];
    const uploadSearch = new UploadSearch();
    this.initializeUploadSearch(uploadSearch);
    const date = new Date();
    const latest_date = this.datepipe.transform(date, 'ddMMyyyy');
    uploadSearch.max = maxCount;
    uploadSearch.min = minCount;
    uploadSearch.fromDate = latest_date;
    uploadSearch.toDate = latest_date;
    this.uploadService.getUploadStatus(uploadSearch).subscribe(
      (resp: any) => {
        this.mandateUploadFileData = resp.data;
        if (this.mandateUploadFileData !== null && this.mandateUploadFileData.length > 0) {
          this.showGrid = true;
          this.noRecords = false;
          this.doesGridDataExistForSearch = true;
        } else {
          this.noRecords = true;
          this.showGrid = false;
          this.doesGridDataExistForSearch = false;
        }
      }, err => {
        this.showGrid = false;
        console.log(`Error on fetching UploadStatus ${JSON.stringify(err)}`);
      });
    // this.uploadService.getUploadCountForUploadGrid(uploadSearch).subscribe((data: any) => {
    //   this.totalRecords = data;
    //   this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //   if (this.totalRecords % this.pageSize === 0) {
    //     this.maxRecords = this.pageSize * this.pageNumber;
    //   } else if (this.totalRecords / this.pageSize >= 1) {
    //     this.maxRecords = this.pageSize;
    //   }
    //   else {
    //     this.maxRecords = this.totalRecords;
    //   }
    // });
  }




  sortGrid(index) {
    this.sortClicked = !this.sortClicked;
    if (this.sortClicked) {
      this.sortingService.sortGrid(index, this.mandateUploadFileData, 'asc').subscribe((data) => {
        this.mandateUploadFileData = data;
      })
    } else {
      this.sortingService.sortGrid(index, this.mandateUploadFileData, 'dsc').subscribe((data) => {
        this.mandateUploadFileData = data;
      })
    }
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

  changeTabIndex(selectedIndex) {
    sessionStorage.setItem("si", selectedIndex);
  }

  changeSummaryTabIndex(selectedIndex) {
    sessionStorage.setItem("summaryIndex", selectedIndex);
  }

  gridSearch() {
    this.noRecords = false;
    const uploadSearch = new UploadSearch();
    uploadSearch.max = '10';
    uploadSearch.min = '1';
    uploadSearch.gridFileType = this.searchFiletype;
    uploadSearch.gridFileProcessingStatus = this.searchFileProcessingStatus;
    uploadSearch.gridErrorFileName = this.searchErrorFileName;
    uploadSearch.gridProcessDate = this.searchDate;
    uploadSearch.gridUploadedFileName = this.searchFileName;
    uploadSearch.gridBatchRef = this.searchBatchRef;
    uploadSearch.gridUploadedBy = this.searchUploadedBy;
    uploadSearch.searchType = 'grid';


    this.uploadService
      .getUploadCountForUploadGrid(uploadSearch)
      .subscribe((data: any) => {
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
    this.uploadService.getUploadStatus(uploadSearch).subscribe(
      (resp: any) => {
        this.mandateUploadFileData = resp.data;
        if (this.mandateUploadFileData !== null && this.mandateUploadFileData.length > 0) {
          this.showGrid = true;
          this.doesGridDataExistForSearch = true;
        } else {
          this.doesGridDataExistForSearch= false;
          this.showGrid = true;
        }
      }, err => {
        this.showGrid = false;
        console.log(`Error on fetching UploadStatus ${JSON.stringify(err)}`);
      });
  }

reset(){
  this.searchFiletype = "";
  this.searchBatchRef = "";
  this.searchFileName = "";
  this.searchDate = "";
  this.searchUploadedBy = "";
  this.searchFileProcessingStatus = "";
  this.searchErrorFileName = "";
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
  batchRef: string;
  uploadedBy: string;
  gridErrorFileName: string;
  searchType: string;
  gridProcessDate: string;
  gridFileType: string;
  gridUploadedFileName: string;
  gridFileProcessingStatus: string;
  gridBatchRef: string;
  gridUploadedBy: string;
}
