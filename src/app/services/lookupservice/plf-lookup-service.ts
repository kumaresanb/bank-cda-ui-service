import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable()
export class LookupService {

    lookupUrl = environment.proxyUrl;

    rsnCodeList = ['C001', 'C002', 'C003', 'C004', 'C005'];

    constructor(private http: HttpClient) { }


    getLookup(lookupCod) {
        return this.http.get(`${this.lookupUrl}/sandstorm/api/lookup?lookupCode=${lookupCod}`);
    }

}