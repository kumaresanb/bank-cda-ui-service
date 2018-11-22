import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";

@Injectable()
export class QueueNameService {
  proxyUrl = environment.proxyUrl;
  queueSubject = new Subject();

  constructor(private http: HttpClient) {}

  getQueueName(requestType,queueType) {
    this.http
      .post(`${this.proxyUrl}/mndworkbench/getQueueNames?requestType=${requestType}&queueType=${queueType}`,null)
      .subscribe((data: any) => {
        if(data!=null){
          this.queueSubject.next(data.data);
        }
      });
  }


  
}
