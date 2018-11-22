import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class SummaryReportService {
    proxyUrl = environment.proxyUrl;

    constructor(private http:HttpClient){}

    getPaymentSummaryReport(summaryForm){
      return this.http.post(`${this.proxyUrl}/report/summaryReport`, JSON.stringify(summaryForm));
    }

    downloadReport(reportObject){
        return this.http.post(`${this.proxyUrl}/report/downoladSummaryViewReport`, JSON.stringify(reportObject));
    }

}