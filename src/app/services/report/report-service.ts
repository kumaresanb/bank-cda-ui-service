import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReportService {
  proxyUrl = environment.proxyUrl;

  resetFields = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getDataForGrid(searchObject: any) {
    console.log("Search Object ",JSON.stringify(searchObject));
    return this.http.post(
      `${this.proxyUrl}/report/getreportdata`,
      searchObject
    );
  }

  downloadFile(fileName: string) {
    return this.http.get(`${this.proxyUrl}/report/download?fileName=${fileName}`, {
      responseType: 'blob'
    });
}

}
