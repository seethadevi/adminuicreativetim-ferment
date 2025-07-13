import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { AppService } from '../shared/services/app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }
  // generateWeezeventAccessToken(req): Observable<any> {
  //   let body_req = '';
  //   body_req = 'username=' + req.username + '&password=' + req.password + '&api_key=' + req.api_key;
  //   return this.communicationService.postWeezevent(this.urls.api['weezeventAccessToken'], body_req);
  // }
  resetAccessToken(req, sub_id): Observable<any> {
    return this.communicationService.put(this.urls.api['weezeventAPI'] + '/subscription/' + sub_id
      + '/resetToken', req);
  }

  getWeezeventSettings(sub_id): Observable<any> {
    return this.communicationService.get(this.urls.api['weezeventAPI'] + '/subscription/' + sub_id
    + '/details');
  }

  // updateWeezeventSetting(req, sub_id): Observable<any> {
  //   return this.communicationService.put(this.urls.api['weezeventAPI'] + '/subscription/' + sub_id
  //   + '/settings', req);
  // }
}
