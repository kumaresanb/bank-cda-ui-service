import {Component, OnInit, OnDestroy} from "@angular/core";
import {AuthenticationService} from "./services/authentication/login/login.service";
import {Subscription} from "rxjs/Subscription";

@Component({selector: "app-root", templateUrl: "./app.component.html", styleUrls: ["./app.component.scss"]})
export class AppComponent implements OnInit,OnDestroy {
    title = "app";
    authenticationSubscription: Subscription;
    isAuthenticated: boolean = false;
    constructor(private authenticationService : AuthenticationService) {}

    ngOnInit() {
        this.authenticationSubscription = this.authenticationService.authenticatedSubject.subscribe((status : boolean) => {
            this.isAuthenticated = status;
        });
    }

    ngOnDestroy() {
        this.authenticationSubscription.unsubscribe();
    }
}
