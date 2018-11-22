import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MandateSubmitPopupComponent } from "./mandate-submit-popup/mandate-submit-popup.component";
import { MandateViewPopupComponent } from "./mandate-view-popup/mandate-view-popup.component";

@Injectable()
export class PopupService {
  constructor(public dialog: MatDialog) {}
  mandateSubmit(msg, successOrfailMsg, msgType) {
    const dialogRef = this.dialog.open(MandateSubmitPopupComponent, {
      width: "250px",
      data: { msg: msg, successOrfailMsg: successOrfailMsg, msgType: msgType }
    });

    return dialogRef.afterClosed();
  }

  mandateView(msg, successOrfailMsg, msgType) {
    const dialogRef = this.dialog.open(MandateViewPopupComponent, {
      width: "250px",
      data: { msg: msg, successOrfailMsg: successOrfailMsg, msgType: msgType }
    });

    return dialogRef.afterClosed();
  }
}
