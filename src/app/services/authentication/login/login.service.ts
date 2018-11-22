import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Authentication} from "../../../models/authentication.model";
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import { BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { RedirectAuthGuardService } from "../../../shared/redirect-auth-guard.service";

@Injectable()
export class AuthenticationService {
    serviceUrl: string = environment.proxyUrl;
    isAuthenticated = false;
    authenticatedSubject = new Subject();
    dtFormat :string;
    loggedInUser:any;
    loggedInUserSubject = new Subject();
    user = new BehaviorSubject(this.loggedInUser); 
    loggedOut = new BehaviorSubject<String>('sessionExpired'); 
    isUserRedirected: boolean = false;
    constructor(private http : HttpClient, private router : Router, private cookieService: CookieService
    ) {}

    authenticate(authentication : Authentication) {
        return this.http.post(`${this.serviceUrl}/auth`, authentication);
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    getToken() {
        return localStorage.getItem("token");
    }

    logout(type) {
        localStorage.clear();
        if(type=='redirect'){
            var domain = location.hostname;
            domain = domain.substring(domain.indexOf('.'));
            domain.trim();  
            this.cookieService.deleteAll('/');  
            this.loggedOut.next('logout'); 
            this.router.navigate(['sessionExpired']); 
        }else{
            this.router.navigate(['']);
        }
        this.authenticatedSubject.next(false);
        this.http.get(`${this.serviceUrl}/logoutClearance`).subscribe(data => {
            this.router.navigate(["/login"]);
        });
    
    }

    isSessionActive() {
        return this.http.get(`${this.serviceUrl}/sessionCheck`);
      } 
    
}
