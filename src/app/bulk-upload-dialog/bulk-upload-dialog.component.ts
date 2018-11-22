import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-bulk-upload-dialog',
  templateUrl: './bulk-upload-dialog.component.html',
  styleUrls: ['./bulk-upload-dialog.component.scss']
})
export class BulkUploadDialogComponent implements OnInit {
  extractedUtilityCode: any = [];
  selectedValue: any;
  constructor(
    public dialogRef: MatDialogRef<BulkUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close(this.myControl.value);
  }
  ngOnInit() {

    this.dialogRef.updateSize("50%", "300px");
  }
  myControl = new FormControl();
  //options: string[] = [this.extractedUtilityCode[0],this.extractedUtilityCode[1] , this.extractedUtilityCode[2]];

}
