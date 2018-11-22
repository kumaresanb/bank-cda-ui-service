import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable()
export class WorkBenchService {
    proxyUrl = environment.proxyUrl;

    constructor(private http : HttpClient) {}

    getBankStatus() {
        return this.http.get(`${this.proxyUrl}/mndworkbench/bankstatus`);
    }

    getCorpStatus() {
        return this.http.get(`${this.proxyUrl}/mndworkbench/corpstatus`);
    }

    getConfirmationStatus() {
        return this.http.get(`${this.proxyUrl}/mndworkbench/confirmationstatus`);
    }

    getAgeingStatus() {
        return this.http.get(`${this.proxyUrl}/mnd/api/workbench/ageingstatus`);
    }

    getMandatesOnQueStatus(searchObj) {
        return this.http.post(`${this.proxyUrl}/mnd/mandate/getMndByQCode`, searchObj);
    }


    getMandatesOnGridSearch(searchObj){
        return this.http.post(`${this.proxyUrl}/mnd/mandate/getBySearchStatus`, searchObj);
    }

    getMandateCountForGrid(searchObj){
        return this.http.post(`${this.proxyUrl}/mnd/mandate/getMandateCountForGrid`, searchObj);
    }

    getUploadStatus(maxRecords, minRecords) {
      return this.http.get(`${this.proxyUrl}/upload/uploadstatus?max=${maxRecords}&min=${minRecords}`);
    }

    getUploadCountStatus(){
        return this.http.get(`${this.proxyUrl}/upload/getCount?queryType=MANDATE`);
    }
}
