
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";


@Injectable()
export class AmendMandateService {

proxyUrl = environment.proxyUrl;
    
constructor(private http : HttpClient) {}

amendMandate(amendMandateObject,action){
    return this.http.post(`${this.proxyUrl}/mnd/mandate/updateMandate?&action=${action}&userName=Saroj`,amendMandateObject);
}
   
}