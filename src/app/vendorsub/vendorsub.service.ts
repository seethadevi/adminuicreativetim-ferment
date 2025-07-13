import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorsubService {

constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Vendor
  saveVendor(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['vendor'], req);
  }

  // HTTP Call for Update Vendor
  updateVendor(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['vendor'] + '/' + req.id, req);
  }

  // HTTP Call for Get Vendor
  getVendor(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['vendor'] + '/' + req.id);
  }

  getSubVendor(req): Observable<any> {
    return this.communicationService.post(this.urls.api['vendor'] + '/subscription/' + req.id, {});
  }

  // HTTP Call for Get Vendor
  deleteVendor(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['vendor'] + '/' + req.id);
  }

  getSubscriptionVender(req): Observable<any> {
    return this.communicationService.get(this.urls.api['vendor'] + '/subscription/' + req.sub_id);
  }

  getVendorsWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['vendor'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }
    if (!!sub_id) {
      query = Object.assign({}, query, {search : {sub_id: { $in: [ sub_id, '', null] }}});
    } else {
      query = Object.assign({}, query, {search : ''});
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
