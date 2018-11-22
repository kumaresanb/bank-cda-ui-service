import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
  selector: 'app-mandate-view-popup',
  templateUrl: './mandate-view-popup.component.html',
  styleUrls: ['./mandate-view-popup.component.scss']
})
export class MandateViewPopupComponent implements OnInit {
  message:any;
  constructor(
    public dialogRef: MatDialogRef<MandateViewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.message = data.msg;
    }

    onClick(status): void {
      this.dialogRef.close(status);
    }



  ngOnInit() {
    this.dialogRef.updateSize("35%", "");
  }

}
