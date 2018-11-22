import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';


@Injectable()
export class DataService
{

    proxyUrl:string = environment.proxyUrl;


    products:any;
    mandateTypes=['PaperMandate','EMandate'];
    PaperMandate
    constructor(private httpClientModule:HttpClient){}

    getActiveProduct(){
         return this.httpClientModule.get(`${this.proxyUrl}/mnd/mandate/getProdctCodes`);

    }

    getCategories(){
        return this.httpClientModule.get(`${this.proxyUrl}/mnd/mandate/getCategories`);

   }



    getRoutingCodeDetails(branchCode){
        let params = new HttpParams().set("branchCode",branchCode);
        return this.httpClientModule.post(`${this.proxyUrl}/mnd/mandate/getRoutingCodes`,branchCode);
    }

    savemandate(user)
    {

    }


}
