import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {environment} from "../../environments/environment";
import { AuthenticationService } from '../services/authentication/login/login.service';



@Injectable()
export class AuthGuardService implements CanActivate{
  serviceUrl = environment.proxyUrl;

  constructor(private authService: AuthenticationService, private router: Router) { 
  }

  canActivate(router: ActivatedRouteSnapshot ,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{

   this.authService.isSessionActive().subscribe((session : any) => {
          if (session != null) {
         return new Observable<true>();
          } else  {
            this.router.navigate(['']);
            return new Observable<false>();
          }
      }, (err) => {
          this.authService.isAuthenticated = false;
          this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
          this.router.navigate(['']);
          return new Observable<true>(); 
      });
      return true;
  }



}
