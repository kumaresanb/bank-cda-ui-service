import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable()
export class PaymentFileSummaryService {

  proxyUrl = environment.proxyUrl;
  constructor(private http: HttpClient) { }

  getDataByFileName(fileName, pageSize, currentPage, queueStatus) {
    return this.http.post(`${this.proxyUrl}/mndworkbench/dataByFileName?fileName=${fileName}&pageSize=${pageSize}&currentPage=${currentPage}&qStatus=${queueStatus}`, fileName);
  }

  rejectSingleRecord(txnRef, rejectComments) {
    return this.http.get(`${this.proxyUrl}/mndworkbench/rejectSingleRecord?txnRef=${txnRef}&rejectComments=${rejectComments}`);
  }

  rejectSingleRecordOnUs(txnRef, rejectComments,reasonCode) {
    return this.http.get(`${this.proxyUrl}/mndworkbench/rejectSingleRecordOnUs?txnRef=${txnRef}&rejectComments=${rejectComments}&reasonCode=${reasonCode}`);
  }


  acceptSingleRecordOnUs(txnRef, rejectComments,reasonCode) {
    return this.http.get(`${this.proxyUrl}/mndworkbench/acceptSingleRecordOnUs?txnRef=${txnRef}&rejectComments=${rejectComments}&reasonCode=${reasonCode}`);
  }


  submitSingleRecordOnUs(txnRef, rejectComments,reasonCode) {
    return this.http.get(`${this.proxyUrl}/mndworkbench/submitSingleRecordOnUs?txnRef=${txnRef}&rejectComments=${rejectComments}&reasonCode=${reasonCode}`);
  }

  rejectReasonList() {
    return this.http.post(`${this.proxyUrl}/mndworkbench/getReasonCodeList`, "");
  }

  reasonDesc(reasonCode) {
    return this.http.post(`${this.proxyUrl}/mndworkbench/getReasonByCode?reasonCode=${reasonCode}`, "");
  }
}
