import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public dialog: MatDialog) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: "250px",
      panelClass: 'myapp-no-padding-dialog',
      backdropClass:'login-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
    });
  }
  ngOnInit() {
    document.body.classList.add('bg-img-login');
  }

  ngOnDestroy(){
    document.body.classList.remove('bg-img-login');
  }

}
