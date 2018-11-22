import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/login/login.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  dashBoardMenus: any;

  constructor(private authService:AuthenticationService) { }

  
  ngOnInit() {
    const menuGroup = this.authService.loggedInUser.role.menuGroup.filter(mg => mg.menuGroupCode === 'dashboard');
    if(menuGroup[0]){
      this.dashBoardMenus = menuGroup[0].menuItems.sort((menu1, menu2) => {
        return menu1.menuItemOrder - menu2.menuItemOrder;
      });
    }
   
  }

}
