import {Component, OnInit, Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Authentication} from "../models/authentication.model";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication/login/login.service";

@Component({selector: "app-login", templateUrl: "./login.component.html", styleUrls: ["./login.component.scss"]})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    dateFormat: string;
    invalidUser = false;
    startIn = [
        {
            value: "home",
            viewValue: "Home"
        },
        //  {
        //     value: "capturemandate",
        //     viewValue: "Capture Mandate"
        // }
    ];

    constructor(private authenticationService : AuthenticationService, private router : Router, public dialogRef : MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA)public data : any) {}

    ngOnInit() {
        this.dialogRef.updateSize("25%", "");
        this.loginForm = new FormGroup({
            userName: new FormControl(null, Validators.required),
            userPassword: new FormControl(null, Validators.required)
        });
    }

    login() {
        const userName = this.loginForm.value.userName;
        const userPassword = this.loginForm.value.userPassword;
        const authentication = new Authentication(userName, userPassword, "FLUX_CDA");
        this.authenticationService.authenticate(authentication).subscribe((user : any) => {
            if (user != null) {
              this.authenticationService.isAuthenticated = true;
              this.authenticationService.authenticatedSubject.next(this.authenticationService.isAuthenticated);
                setTimeout(() => {
                    this.authenticationService.setToken(user.token);
                    //Need to update below hardcoded to user.supportedDtformat.format
                    this.authenticationService.dtFormat = "dd/MM/yyyy hh:mm:ss";
                    this.dateFormat = this.authenticationService.dtFormat;
                    this.authenticationService.loggedInUser = user.data;
                    this.authenticationService.loggedInUserSubject.next(user.data);
                    this.router.navigate(["homepage"]);
                }, 1000);
                this.dialogRef.close();
            } else {
                this.router.navigate([""]);
            }
        }, err => {
            this.invalidUser = true;
            this.authenticationService.isAuthenticated = false;
            this.loginForm.reset();
        });
    }

    onNoClick(): void {
        this.dialogRef.close(status);
    }
}
