import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'getValues'})
export class GetValuesPipe implements PipeTransform {
    transform(json: Map<any, any>): any[] {
        const ret = [];
        const map = this.objToStrMap(json);
        map.forEach((value, key) => {
            ret.push({
                key: key,
                value: value
            });
        });
        return ret.slice(1);
    }

    objToStrMap(obj) {
      const strMap = new Map();
      for (const k of Object.keys(obj)) {
          strMap.set(k, obj[k]);
      }
      return strMap;
  }
}
