import {Component, OnInit, OnDestroy} from "@angular/core";
import {AuthenticationService} from "../services/authentication/login/login.service";
import { Router } from "@angular/router";
import { ConfigService } from "../services/config/config-service";
import { Subscription } from "rxjs";
import { environment } from "../../environments/environment";

@Component({selector: "app-header", templateUrl: "./header.component.html", styleUrls: ["./header.component.scss"]})
export class HeaderComponent implements OnInit,OnDestroy {
    constructor(private authService : AuthenticationService,  private router : Router,
    private configService:ConfigService) {}


    isAuthenticated:boolean;
    dateTodisplay:Date;
    dtFormat:any;
    matmenugroup:any;
    subscription:Subscription;
    tenantId: string;
    tenantName: string;
    emandateUrl = environment.emandateUrl;
    userName: string;
    userRole: string;
    ngOnInit() {

    this.subscription = this.authService.loggedInUserSubject.subscribe((loggedInUser:any)=>{
        if(loggedInUser.applicationCode=='FLUX_CDA'){
            this.isAuthenticated = this.authService.isAuthenticated;
            this.tenantId = loggedInUser.tenantId;
            this.tenantName = loggedInUser.tenantName;
            this.userName = loggedInUser.userName;
            this.userRole = loggedInUser.role.roleType;
            const menuGroup = loggedInUser.role.menuGroup.filter(
                mg => mg.menuGroupCode === "matmenugroup"
              );
              this.matmenugroup = menuGroup[0].menuItems.sort((menu1, menu2) => {
                return menu1.menuItemOrder - menu2.menuItemOrder;
              });
        }else{
            //Doesn't have access to flux_cda  
        }

    })

        this.dateTodisplay=new Date();
        this.dtFormat=this.configService.getDateFormat();
    }

   /* navigateEmandate(){
     window.open(this.emandateUrl, "_blank");
   } */

    logout() {
        if(this.authService.isUserRedirected){
            this.authService.logout('redirect');
        }else{
            this.authService.logout('normalLogin'); 
        }
    }

    changeTabIndex(selectedIndex) {
        sessionStorage.setItem("si", selectedIndex);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
