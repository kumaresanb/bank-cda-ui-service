import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class SortingService {
  sortGrid(index, arrayTosort, direction): Observable<Object> {
    if (direction === "asc") {
      arrayTosort.sort((data1, data2) => {
        if (data1[index] > data2[index]) {
          return 1;
        } else if (data1[index] < data2[index]) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      arrayTosort.sort((data1, data2) => {
        if (data1[index] < data2[index]) {
          return 1;
        } else if (data1[index] > data2[index]) {
          return -1;
        } else {
          return 0;
        }
      });
    }
    return arrayTosort;
  }
}
