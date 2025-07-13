import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Shop
  callForgotPassword(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['forgotpassword'] + '/forgotPasswordEmail' , req);
  }

  callChangePassword(req, typeofuser, id) {
    return this.communicationService.post(this.urls.api['forgotpassword'] + '/changePassword', req);
  }
}
