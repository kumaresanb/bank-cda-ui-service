import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import { Subject } from "rxjs";


@Injectable()
export class MandateEnquiryService { 

    proxyUrl = environment.proxyUrl;
    activeMandate =[{q_code:'ACC-300',q_status:'Active'},
    {q_code:'ACC-300',q_status:'Cancelled'},
    {q_code:'ACC-300',q_status:'Expired'},
    {q_code:'ACC-300',q_status:'InActive'},
    {q_code:'ACC-300',q_status:'Amended'}];

    ongoingmandates = [{q_code:'ERR300',q_status:'Exception'}, 
    {q_code:'PSA-300',q_status:'Pending Authorization'},
    {q_code:'REA-300',q_status:'Rejected By Authorizer'},
    {q_code:'PFG-300',q_status:'Pending Send'},
    {q_code:'DEL-300',q_status:'Deleted'},
    {q_code:'DEL-300',q_status:'Presented to Bank'},
    {q_code:'DEL-300',q_status:'Rejected by Bank'},
    {q_code:'DEL-300',q_status:'Presented to Clearing House'},
    {q_code:'DEL-300',q_status:'Rejected by Clearing House'},
    {q_code:'ACK-300',q_status:'Send to Destination bank'},
    {q_code:'ACC-300',q_status:'Accepted'},
    {q_code:'REJ-300',q_status:'Rejected'}];
  
    resetFields = new Subject<boolean>();
    
constructor(private http: HttpClient) { }

    getEnquiryData(searchObject:any) {
        return this.http.post(`${this.proxyUrl}/mndworkbench/getMandateEnquiry`,searchObject);


        //return this.http.post(`${this.proxyUrl}/mnd/mandateEnquiry/searchMandate`, searchObject);
    }

    getCountForGrid(searchObject:any)
    {
        return this.http.post(`${this.proxyUrl}/mndworkbench/getMandateEnquiryCount`,searchObject);


    }

    getmandateenqiryStatus(mandateStatus) {
        if (mandateStatus === 'activeMandate') {
            return this.activeMandate;
        } else {
            return this.ongoingmandates;
        }
    }


}