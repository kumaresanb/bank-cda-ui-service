import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-upload-success-popup',
  templateUrl: './upload-success-popup.component.html',
  styleUrls: ['./upload-success-popup.component.scss']
})
export class UploadSuccessPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UploadSuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

  ngOnInit() {
    this.dialogRef.updateSize("45%", "");
  }

}
