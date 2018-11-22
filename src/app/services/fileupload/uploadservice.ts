import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable()
export class UploadService {

    proxyUrl = environment.proxyUrl;


    constructor(private http: HttpClient) { }


    fileUpload(file: File, lookupCode, value) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lookupCode', lookupCode);
        formData.append('value', value);
      return  this.http.post(`${this.proxyUrl}/upload/fileUpload`, formData);
    }

    getUploadCountForUploadGrid(uploadSearch){
      return this.http.post(`${this.proxyUrl}/upload/getCountForGrid`, uploadSearch);
  }

    getUploadStatus(uploadSearch) {
      return this.http.post(`${this.proxyUrl}/upload/getfileStatus`, uploadSearch);
    }

    getUploadQueueStatus(max, min, queryType) {
      const uploadSearch = {max, min, queryType};
      uploadSearch.max = max;
      uploadSearch.min = min;
      uploadSearch.queryType = queryType;
      return this.http.post(`${this.proxyUrl}/upload/uploadstatus`, uploadSearch);
    }

    getUploadQueueStatusForOnUs(max, min, queryType,fileType){
      const uploadSearch = {max, min, queryType,fileType};
      uploadSearch.max = max;
      uploadSearch.min = min;
      uploadSearch.queryType = queryType;
      uploadSearch.fileType='OnUs';
      return this.http.post(`${this.proxyUrl}/upload/uploadstatus`, uploadSearch);
    }

    getUtilityCode(tenantId){
      return this.http.get(`${this.proxyUrl}/upload/utility/${tenantId}`);
    }

    getUploadCountStatus(uploadSearch) {
      return this.http.post(`${this.proxyUrl}/upload/getCount`, uploadSearch);
  }
  downloadFile(fileName: string) {
    return this.http.get(`${this.proxyUrl}/upload/download?fileName=${fileName}`, {
      responseType: 'blob'
    });
  }
}
