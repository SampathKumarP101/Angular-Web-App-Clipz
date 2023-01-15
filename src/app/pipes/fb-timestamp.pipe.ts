import  firebase  from 'firebase/compat/app';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {
  constructor(private dataPipe: DatePipe){

  }

  transform(value: firebase.firestore.FieldValue | undefined){
    if(!value){
      return '';
    }
    const date = (value as firebase.firestore.Timestamp).toDate()
    return this.dataPipe.transform(date, 'mediumDate');
  }

}
