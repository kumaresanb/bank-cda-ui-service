import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
  selector: 'app-mandate-submit-popup',
  templateUrl: './mandate-submit-popup.component.html',
  styleUrls: ['./mandate-submit-popup.component.scss']
})
export class MandateSubmitPopupComponent implements OnInit {
  user:any;
  constructor( 
    public dialogRef: MatDialogRef<MandateSubmitPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.user=data.msg;
    }
   
   // this.user=data.user;

    onNoClick(status): void {
      this.dialogRef.close(status);
    }

    

  ngOnInit() {
    this.dialogRef.updateSize("50%", "");
  }

}
