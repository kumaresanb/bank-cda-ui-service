import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {

  HttpHeaders,
  HttpClient
} from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { environment } from "../../environments/environment";
import { AuthenticationService } from '../services/authentication/login/login.service';


@Injectable()
export class RedirectAuthGuardService {

  zuulURL = environment.proxyUrl;
  headers: HttpHeaders;
  constructor(private authService: AuthenticationService, private router: Router, private http: HttpClient, private cookieService: CookieService) {
    this.headers = new HttpHeaders({ "Content-Type": "application/json" });
  }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    var cookies = document.cookie;
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }


    if (getCookie('token') && getCookie('userId')) {
      localStorage.setItem('token', getCookie('token'));
      localStorage.setItem('userId', getCookie('userId'));
      document.cookie
      this.authService.isAuthenticated = true;
      this.authService.isUserRedirected=true;
      this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
      this.isSessionActive().subscribe((session: any) => {
        if (session != null) {
          this.router.navigate(['redirect']);
          return new Observable<true>();
        } else {
          this.router.navigate(['login']);
          return new Observable<true>();
        }
      }, (err) => {
        this.authService.isAuthenticated = false;
        this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
        this.router.navigate(['']);
        return new Observable<true>();
      });
    } else {
      return true;
    }
  }

  isSessionActive() {
    return this.http.get(`${this.zuulURL}/sessionCheck`, { headers: this.headers });
  }
}
