import {
    HttpEvent,
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpHeaders,
    HttpClient
} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/do";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {AuthenticationService} from "../services/authentication/login/login.service";


@Injectable()
export class CustomHttpIntercepter implements HttpInterceptor {
    serviceUrl = environment.proxyUrl;
    headers: HttpHeaders;
    constructor(private http : HttpClient, private router : Router, private authService : AuthenticationService) {
        this.headers = new HttpHeaders({"Content-Type": "application/json"});
    }

    intercept(req : HttpRequest<any>, next : HttpHandler): Observable<HttpEvent<any>> {
        //1.Step  check authService.isAuthenticated is 'false' if yes continue the request.
        if (this.authService.isAuthenticated === false) {
            if (req.url === `${this.serviceUrl}/auth`) {
                return next.handle(req);
                
            } else {
                this.authService.isAuthenticated = false;
                this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
                this.router.navigate(['']);
                return new Observable<null>(); 
//before it was returning only null.. throws an error TypeError: You provided an invalid object where a stream was expected. You can provide an Observable, Promise, Array, or Iterable
            }
        }

        //2.Step check authService.isAuthenticated is 'true'
        if (this.authService.isAuthenticated === true && this.authService.getToken() != null) {
            if (req.url != `${this.serviceUrl}/sessionCheck`) {
                this.authService.isSessionActive().subscribe((session : any) => {
                    if (session != null) {
                        this.authService.setToken(session.token);
                        this.authService.isAuthenticated = true;
                        this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
                        this.headers = new HttpHeaders({"Content-Type": "application/json", Authorization: this.authService.getToken()});
                        const modifiedRequest = req.clone({headers: this.headers});
                        return next.handle(modifiedRequest);
                    } else {
                        this.authService.isAuthenticated = false;
                        this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
                        this.router.navigate(['']);
                        return new Observable<null>(); 
                    }
                }, err => {
                    this.authService.isAuthenticated = false;
                    this.authService.authenticatedSubject.next(this.authService.isAuthenticated);
                    this.router.navigate(['']);
                    return new Observable<null>(); 
                });
            }

            this.headers = new HttpHeaders({"Content-Type": "application/json", Authorization: this.authService.getToken()});
            const modifiedRequest = req.clone({headers: this.headers});

            if (req.url.indexOf('/upload/fileUpload') > -1) {
                this.headers = new HttpHeaders({Authorization: this.authService.getToken()});
                const uploadRequest = req.clone({headers: this.headers});
                console.log('Upload Request', uploadRequest);
                return next.handle(uploadRequest);
              }

            return next.handle(modifiedRequest);
        }
    }

    
}
