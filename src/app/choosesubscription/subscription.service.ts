import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { AppService } from '../shared/services/app.service';


@Injectable()
export class SubscriptionService {
  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save Subscription
  saveSubscription(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['subscription'], req);
  }

  // HTTP Call for Update Subscription
  updateSubscription(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['subscription'] + '/' + req.id, req);
  }

  // HTTP Call for Get Subscription
  getSubscriptions(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['subscription'] + '/' + req.id);
  }

  // HTTP Call for Delete Subscription
  deleteSubscription(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['subscription'] + '/' + req.id);
  }

  getSubscriptionsWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    const query = Object.assign({}, defaults, params);

    const url = this.urls.api['subscription'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    if (query.searchvalue.length > 1 && !!query.searchelems.length) {
      const search = [];
      query.searchelems.map((item) => {
        // searchJSON = '{' + item + ':' +  '{' + '$regex:' + '.*' + query.searchvalue + '.*,' + '$options:' + 'i' + '}' + '}');
        search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
      });
      // console.log(search);
      query['search'] = { '$or':  search };
    }

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }
}
