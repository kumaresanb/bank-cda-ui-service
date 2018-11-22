import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { AuthenticationService } from "../services/authentication/login/login.service";

@Component({selector: "app-sessionexpired",
 templateUrl: "./sessionexpired.component.html", 
 styleUrls: ["./sessionexpired.component.scss"]})
export class SessionexpiredComponent implements OnInit {

    sessionExpiredMessage = 'Your session has expired';
    logoutMessage = 'You have been logged out!';
    status=false;
    constructor(private authenticationService:AuthenticationService,private router : Router) {}
 
    ngOnInit() {
        this.authenticationService.authenticatedSubject.next(false);
        this.authenticationService.loggedOut.subscribe((response)=>{
            if(response=='logout'){
                this.status = true;
            }
        })
    }
    
}
