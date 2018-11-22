import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable()
export class ViewService {
  proxyUrl = environment.proxyUrl;

  constructor(private http: HttpClient) { }

  getByMndRefNo(mndRefNum) {
    return this.http.post(
      `${this.proxyUrl}/mnd/mandate/getByMndRefNo?mndRefNo=${mndRefNum}`,
      null
    );
  }


  accountInquiryService(custAccNumber) {
    return this.http.post(`${this.proxyUrl}/mnd/webservice/cdadogeneralenq?custAccNumber=${custAccNumber}`, custAccNumber)
  }


  getActiveMandateByMndRefNo(mndRefNum) {
    return this.http.post(
      `${this.proxyUrl}/mnd/mandate/getActiveMandateByMndRefNo?mndRefNo=${mndRefNum}`,
      null
    );
  }

  getDocumentByDocRefNum(docRefNum) {
    return this.http.post(
      `${this.proxyUrl}/mnd/mandate/getDocumentByDocRefNum?docRefNum=${docRefNum}`,
      null
    );
  }

  processMandate(mandate, action) {
    return this.http.post(
      `${this.proxyUrl}/mnd/mandate/processMandate?&action=${action}`,
      mandate
    );
  }

  processMandateReject(mandate) {
    return this.http.post(
      `${this.proxyUrl}/mnd/mandate/processMandate?&action=REJ`,
      mandate
    );
  }
}
