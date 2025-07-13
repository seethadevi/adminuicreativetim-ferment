import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatasharingService {

  private eventShopOption = new BehaviorSubject({isPrivate: false, channels: []});
  currentMessage = this.eventShopOption.asObservable();

  constructor() { }

  changeMessage(message: any) {
    this.eventShopOption.next(message);
  }
}
