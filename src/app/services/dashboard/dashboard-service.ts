import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable()
export class DashboardService {

    proxyUrl = environment.proxyUrl;


    constructor(private http: HttpClient) { }

    getDashboardData() {
      return this.http.get(`${this.proxyUrl}/dashboard/getdashboarddata`);
  }
}
