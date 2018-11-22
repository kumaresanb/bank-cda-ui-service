import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()
export class PaymentEnquiryService {

    proxyUrl = environment.proxyUrl;
    constructor(private http: HttpClient) { }


    paymentEnquiry(searchObject:any) {
        return this.http.post(`${this.proxyUrl}/mndworkbench/getEnquiry`,searchObject);
    }

    getCountForGrid(searchObject){
        return this.http.post(`${this.proxyUrl}/mndworkbench/getPaymentEnquiryCount`,searchObject);
    }

}