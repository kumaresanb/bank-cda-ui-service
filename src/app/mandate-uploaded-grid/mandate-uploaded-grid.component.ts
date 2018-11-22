import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WorkBenchService } from '../services/mandate/workbench/workbench-service';
import { UploadService } from '../services/fileupload/uploadservice';
import { SortingService } from '../services/sortingservice/sorting-service';
import { MandateFileSearchService } from '../services/gridsearchservices/mandate-file-summary-service';

@Component({
  selector: 'app-mandate-uploaded-grid',
  templateUrl: './mandate-uploaded-grid.component.html',
  styleUrls: ['./mandate-uploaded-grid.component.scss']
})
export class MandateUploadedGridComponent implements OnInit {
  //word split
  showHide: any;
  showHide1: any;
  mandateUploadHeader: any;
  mandateUploadFileData: any;
  selectedresultRangeValue: any;
  gridsearch: boolean = false;
  pageNumber: any;
  pageSize: any;
  sortClicked = false;
  totalRecords: any;
  totalPages: any;
  maxRecords: any;
  minRecords: any;
  fileName: any;
  doesGridDataExistForSearch: boolean = true;
  doesGridDataExist: boolean = true;
  noRecords: boolean = false;
  resultRangeValue = [
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

  @ViewChild('tablescroll', { read: ElementRef }) public tablescroll: ElementRef;

  public scrollRight(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft + 300), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.tablescroll.nativeElement.scrollTo({ left: (this.tablescroll.nativeElement.scrollLeft - 300), behavior: 'smooth' });
  }

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
  constructor(private workBenchService: WorkBenchService,
    private sortingService: SortingService,
    private uploadService: UploadService,
    private searchService: MandateFileSearchService) { }

  fetchDataforGrid(maxRecrds, minRecrds) {
    this.uploadService.getUploadQueueStatus(maxRecrds, minRecrds, 'MANDATE').subscribe((resp: any) => {
      this.mandateUploadFileData = resp.data;
      console.log("resp.data", resp.data);
      if(resp.data==null){
        this.doesGridDataExist = false;
        this.noRecords = true;
      }else{
        this.doesGridDataExistForSearch = true;
        this.doesGridDataExist = true;
        this.noRecords = false;
      }
    
    },
      err => {
        console.log(`Error on fetching UploadStatus ${JSON.stringify(err)}`);
      });
  }





  ngOnInit() {
    this.pageNumber = 1;
    this.maxRecords = this.pageSize = 10;
    this.minRecords = 1;
    this.selectedresultRangeValue = 10;
    const uploadSearch = new UploadSearch();
    this.initializeUploadSearch(uploadSearch);
    uploadSearch.queryType = 'MANDATE';
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

    // this.mandateUploadHeader = ["Bulk File Name","Total Count", "Exception", "Pending Send", "Presented to Clearing house", "Rejected by Clearing house", "Send to destination Bank", "Accepted", "Rejected"];
    this.mandateUploadHeader = ["Bulk File Name","Exception", "Pending Send", "Presented to Clearing house", "Rejected by Clearing house", "Send to destination Bank", "Accepted", "Rejected"];
    this.fetchDataforGrid(this.maxRecords, this.minRecords);
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
    let searchObject: MandateFileSearchObj = new MandateFileSearchObj();
    searchObject.fileName = fileName;
    searchObject.max = this.maxRecords;
    searchObject.min = this.minRecords;
    searchObject.messageType="MANDATE";  

    this.searchService.fileGridSearch(searchObject).subscribe((data: any) => {
      this.mandateUploadFileData = data.data;
      if(data.data==null){
        this.doesGridDataExistForSearch = false;
        this.noRecords = true;
      }else{
        this.getCount(searchObject);  
        this.doesGridDataExistForSearch = true;
        this.noRecords = false;
      }
    });


  }


  getCount(searchObject){
    this.searchService.fileGridSearchCount(searchObject).subscribe((data: any) => {
      this.totalRecords = data.data;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      if (this.totalRecords % this.pageSize === 0) {
        this.maxRecords = this.pageSize * this.pageNumber;
      }
   else {  
        this.maxRecords = (this.pageSize * (this.pageNumber-1) + this.mandateUploadFileData.length); 
      }    
    });
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

export class MandateFileSearchObj {
  fileName: string;
  max: any;
  min: any;
  messageType:any;
}
