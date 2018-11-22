import { Component, OnInit } from '@angular/core';  
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';  
import { AuthenticationService } from '../services/authentication/login/login.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  loggedInUser: any = {};
  userId = '';
  platformUrl = environment.proxyUrl; 
  headers: HttpHeaders = new HttpHeaders();
  color = 'primary';
  mode = 'indeterminate'; 
  dataLoadingMessage: string = '';
  redirected: boolean = false;
  hasAccess: boolean = true; 
  constructor(private activatedRoute: ActivatedRoute, private authService: AuthenticationService, private router: Router, private http: HttpClient, private cookieService: CookieService) {
    this.headers = new HttpHeaders({
      'X-TENANT-ID': 'T001',
      'X-USER': 'kAVYA',
      'X-IP-HEADER': '10.101.12',
      'X-ENTITY-ID': 'H001B001',
      'X-ACCESS-LEVEL': '0',
      'Content-Type': 'application/json'
    })
  }

  ngOnInit() {  
  
    this.dataLoadingMessage = 'Authenticating User....';
      this.http.get(`${this.platformUrl}/sandstorm/api/user`, {
        headers: this.headers,
        params: {   
          userId: localStorage.getItem('userId')     
        }    
      }).subscribe((response: any) => {    
        if(response.data.length>0){
          this.authService.loggedInUserSubject.next(response.data[0]);
          this.authService.loggedInUser = response.data[0]; 
          setTimeout(()=>{  
              if(response.data.length>0){
                this.dataLoadingMessage = 'Redirecting to Home Page..';
                if(response.data[0].applicationCode!='FLUX_CDA'){
                  setTimeout(()=>{ 
                    this.hasAccess = false;   
                    this.dataLoadingMessage = `Seems like you don't have access to FLUX-CDA`; 
                 }, 300); 
                }else{  
                  setTimeout(()=>{ 
                    this.redirected = true;
                   this.router.navigate(['homepage']);
                 }, 300);
                }
              }
          }, 300);  
        }else{ 
                this.dataLoadingMessage = 'Unable to Authenticate. Logging Out!';
                setTimeout(()=>{
                  this.redirected = true;
                  this.router.navigate(['']);
                }, 300);  
              }
            }
                  
      )
    } 
}
