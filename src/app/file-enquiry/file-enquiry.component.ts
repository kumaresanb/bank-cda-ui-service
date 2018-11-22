import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgxDrpOptions, PresetItem, Range, RangeStoreService } from "ngx-mat-daterange-picker";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UploadService } from "../services/fileupload/uploadservice";
import { DatePipe } from "@angular/common";
import { LookupService } from "../services/lookupservice/plf-lookup-service";
import { SortingService } from "../services/sortingservice/sorting-service";
import { ConfigService } from "../services/config/config-service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-file-enquiry",
  templateUrl: "./file-enquiry.component.html",
  styleUrls: ["./file-enquiry.component.scss"]
})
export class FileEnquiryComponent implements OnInit {
  resultRangeValue: any;
  fileEnquiryHeader: any;
  fileEnquiryData: any;
  selectedresultRangeValue: any;
  fileEnquiryForm: FormGroup;
  maxRecords: any;
  minRecords: any;
  messageType: any;
  fileStatus: any;
  doesGridDataExistForSearch: boolean = true;
  doesGridDataExist: boolean = true;
  gridSearchClicked: boolean = false;
  pageNumber: any;
  pageSize: any;
  totalPages: any;
  totalRecords: any;
  dateTimeFormat: any;
  fileEnquirySearch: any;
  searchFiletype: string;
  searchBatchRef: string;
  searchFileName: string;
  searchDate: string;
  searchUploadedBy: string;
  searchFileProcessingStatus: string;
  searchErrorFileName: string;
  enquiryClicked: boolean = false;
  item1: any;
  item2: any;
  futureDateSelected: boolean = false;
  sortClicked: any;
  showGrid = false;
  noRecords = false;
  gridSearchObject: any;

  range: Range = { fromDate: new Date(), toDate: new Date() };
  invalidDateRange: boolean = false;


  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  selected = "filestatus";
  filestatus = [
    { value: "SUCCESS", viewValue: "Success" },
    { value: "ERROR", viewValue: "Error" },
    { value: "IN PROGRESS", viewValue: "In Progress" }
  ];

  @ViewChild('tablescroll', { read: ElementRef }) public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

  //word split
  getSplitWord = function (item) {
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

  constructor(
    private uploadService: UploadService,
    public datepipe: DatePipe,

    private lookupCodeService: LookupService,
    private configService: ConfigService,
    private sortingService: SortingService,
    private rangeStoreService: RangeStoreService
  ) {
    this.fileEnquirySearch = new FileEnquirySearch();
    this.ngOnInit();
    this.dateTimeFormat = this.configService.getDateTimeFormat();
  }

  pageSizeChanged(event: any) {
    this.pageNumber = 1;
    this.pageSize = event.target.value;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.maxRecords = this.pageNumber * event.target.value;
    this.minRecords = 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.gridSearchObject;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.fileEnquiryForm.value);
    }
  }

  previousClicked() {
    this.pageNumber = this.pageNumber - 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;
    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.gridSearchObject;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.fileEnquiryForm.value);
    }
  }

  nextClicked() {
    this.pageNumber = this.pageNumber + 1;
    this.maxRecords = this.pageNumber * this.pageSize;
    this.minRecords = (this.pageNumber - 1) * this.pageSize + 1;

    if (this.gridSearchClicked) {
      let searchObjectForGrid = this.gridSearchObject;
      this.fetchDataForGrid(searchObjectForGrid);
    } else {
      this.fetchDataForGrid(this.fileEnquiryForm.value);
    }
  }

  reset() {
    this.currentDate();
    this.fileEnquiryForm.reset();
    this.fileEnquiryData = [];
    this.showGrid = false;
    this.noRecords = false;
    let today = new Date();
    this.rangeStoreService.updateRange(today, today);

  }

  ngOnInit() {
    this.searchFiletype = '';
    this.searchBatchRef = '';
    this.searchFileName = '';
    this.searchDate = '';
    this.searchUploadedBy = '';
    this.searchFileProcessingStatus = '';
    this.searchErrorFileName = '';
    this.fileEnquirySearch = new FileEnquirySearch();
    this.dateTimeFormat = this.configService.getDateTimeFormat();
    this.lookupCodeService.getLookup("IMPORT_TYPE").subscribe((data: any) => {
      this.messageType = data.data;
    });

    this.fileEnquiryForm = new FormGroup({
      fileType: new FormControl(Validators.required),
      uploadedFileName: new FormControl(),
      fileProcessingStatus: new FormControl()
    });

    this.selectedresultRangeValue = "10";
    this.resultRangeValue = [
      { value: "5", viewValue: "5" },
      { value: "10", viewValue: "10" },
      { value: "15", viewValue: "15" },
      { value: "20", viewValue: "20" }
    ];

    this.pageNumber = 1;
    this.maxRecords = this.pageSize = this.selectedresultRangeValue;
    this.minRecords = 1;

    this.fileEnquiryHeader = [
      "File Type",
      "File Id",
      "Uploaded File Name",
      "Uploaded Date & Time",
      "Uploaded By",
      "File Processing Status",
      "Error File"
    ];


    // const fromMin = new Date(today.getFullYear(), today.getMonth()-2, 1);
    // const fromMax = new Date(today.getFullYear(), today.getMonth()+1, 0);
    // const toMin = new Date(today.getFullYear(), today.getMonth()-1, 1);
    // const toMax = new Date(today.getFullYear(), today.getMonth()+2, 0);

    this.setupPresets();
    this.currentDate();
  }

  //handler function that receives the updated date range object
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
  currentDate() {
    const today = new Date();
    this.options = {
      presets: this.presets,
      format: "dd/MM/yyyy",
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit"
    };
  }

  gridSearch() {

    let fileEnquirySearch = new FileEnquirySearch();
    fileEnquirySearch= this.fileEnquirySearch;
    this.gridSearchClicked = true;
    fileEnquirySearch.max = '10';
    fileEnquirySearch.min = '1';
    fileEnquirySearch.fromDate = this.fileEnquirySearch.fromDate;
    fileEnquirySearch.toDate = this.fileEnquirySearch.toDate;
    fileEnquirySearch.gridFileType = this.searchFiletype;
    fileEnquirySearch.gridFileProcessingStatus = this.searchFileProcessingStatus;
    fileEnquirySearch.gridErrorFileName = this.searchErrorFileName;
    fileEnquirySearch.gridProcessDate = this.searchDate;
    fileEnquirySearch.gridUploadedFileName = this.searchFileName;
    fileEnquirySearch.gridBatchRef = this.searchBatchRef;
    fileEnquirySearch.gridUploadedBy = this.searchUploadedBy;
    fileEnquirySearch.searchType = 'grid';
    this.gridSearchObject = fileEnquirySearch;
    this.uploadService
      .getUploadCountForUploadGrid(fileEnquirySearch)
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


    this.uploadService.getUploadStatus(fileEnquirySearch).subscribe((data: any) => {
      if (data != null && data.data != null) {
        this.doesGridDataExist = true;
        this.doesGridDataExistForSearch = true;
        this.fileEnquiryData = data.data;
      } else {

        this.fileEnquiryData = [];
        this.noRecords = false;
        this.doesGridDataExist = false;
        this.doesGridDataExistForSearch = false;
      }
      this.showGrid = true;
    });

  }


  //helper function to create initial presets
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

  enquireFormSubmit(formDetails) {
    this.enquiryClicked = true;
    this.gridSearchClicked = false;
    this.noRecords = false;
    this.pageNumber = 1;  
    this.maxRecords = 10;  
    this.minRecords = 1;
    this.fileEnquirySearch = new FileEnquirySearch();
    this.searchFiletype = '';
    this.searchBatchRef = '';
    this.searchFileName = '';
    this.searchDate = '';
    this.searchUploadedBy = '';
    this.searchFileProcessingStatus = '';
    this.searchErrorFileName = '';
    this.fileEnquiryData = [];  
    this.fetchDataForGrid(this.fileEnquiryForm.value);
  }

  sortGrid(index) {
    this.sortClicked = !this.sortClicked;
    if (this.sortClicked) {
      this.sortingService
        .sortGrid(index, this.fileEnquiryData, "asc")
        .subscribe(data => {
          this.fileEnquiryData = data;
        });
    } else {
      this.sortingService
        .sortGrid(index, this.fileEnquiryData, "dsc")
        .subscribe(data => {
          this.fileEnquiryData = data;
        });
    }
  }

  fetchDataForGrid(formDetails) {
    const searchObject = formDetails;
    this.fileEnquirySearch = formDetails;

    if (formDetails.uploadedFileName === null) {
      searchObject.uploadedFileName = '';
      this.fileEnquirySearch.uploadedFileName = '';
    }
    if (formDetails.fileProcessingStatus === null) {
      searchObject.fileProcessingStatus = '';
      this.fileEnquirySearch.fileProcessingStatus = '';
    }
    if (formDetails.fileType === null) {
      searchObject.fileType = '';
      this.fileEnquirySearch.fileType = '';
    }
    searchObject.fromDate = this.datepipe.transform(
      this.range.fromDate,
      "dd-MM-yy"
    );
    searchObject.toDate = this.datepipe.transform(
      this.range.toDate,
      "dd-MM-yy"
    );

    searchObject.max = this.maxRecords;
    searchObject.min = this.minRecords;
    this.uploadService.getUploadStatus(searchObject).subscribe((data: any) => {
      if (data != null && data.data != null) {
        this.fileEnquiryData = data.data;
        this.doesGridDataExistForSearch = true;

        if (data.data.length == this.pageSize) {
          this.maxRecords = this.pageNumber * this.pageSize;
        }
        else if (data.data.length < this.pageSize) {
          this.maxRecords = this.totalRecords;
        }
      }
      else {
        this.noRecords = true;
        this.doesGridDataExistForSearch = false;
      }

      this.showGrid = true;
    });
    this.uploadService
      .getUploadCountForUploadGrid(searchObject)
      .subscribe((data: any) => {
        this.totalRecords = data;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      });
  }

getFileTypeName(fileTypeCode){     

for(let fileType of this.messageType){
  if(fileType.value==fileTypeCode){
    return fileType.valueOne;
  }
}
}
  download(fileName) {
    this.uploadService.downloadFile(fileName).subscribe(data => {
      saveAs(data, fileName);
    });
  }

}   

export class FileEnquirySearch {
         max: string;
         min: string;
         queryType: string;
         fileType: string;
         uploadedFileName: string;
         fromDate: Date;
         toDate: Date;
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
