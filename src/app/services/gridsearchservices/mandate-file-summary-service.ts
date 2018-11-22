import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable()
export class MandateFileSearchService {
    proxyUrl = environment.proxyUrl;


    constructor(private http: HttpClient) { }


    fileGridSearch(searchObject) {
        return this.http.post(`${this.proxyUrl}/mndworkbench/fileStatusGridSearch`, searchObject);
    }

    fileGridSearchCount(searchObject){
        return this.http.post(`${this.proxyUrl}/mndworkbench/fileStatusGridSearchCount`, searchObject);
    }



    authBulkPayment(fileNames, action){
      return this.http.post(`${this.proxyUrl}/mndworkbench/authBulkPayment?action=${action}`, fileNames);
    }


}
