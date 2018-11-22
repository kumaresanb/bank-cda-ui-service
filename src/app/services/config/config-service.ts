import {Injectable} from "@angular/core";

@Injectable()
export class ConfigService {
  dtFormat: string;
  dtTimeFormat:string;

  constructor() {
  }

  getDateFormat(){
    this.dtFormat = "dd-MM-yyyy";
    return this.dtFormat;
  }

  getDateTimeFormat(){
    this.dtTimeFormat = "dd-MM-yyyy hh:mm:ss";
    return this.dtTimeFormat;
  }
}
