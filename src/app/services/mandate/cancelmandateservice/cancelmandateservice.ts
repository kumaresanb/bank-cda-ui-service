import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";


@Injectable()
export class CancelMandateService {

proxyUrl = environment.proxyUrl;
    
constructor(private http : HttpClient) {}

cancelMandate(cancelMandateObject,cancelCode){
    return this.http.post(`${this.proxyUrl}/mnd/mandate/cancelMandate?&cnclCode=${cancelCode}`,cancelMandateObject);
}
   
}