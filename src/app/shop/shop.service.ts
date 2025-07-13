import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable()
export class ShopService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Shop
  saveShop(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['shop'], req);
  }

  // HTTP Call for Update Shop
  updateShop(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['shop'] + '/' + req.id, req);
  }

  // HTTP Call for Get Shop
  getShop(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['shop'] + '/' + req.id);
  }

  getSubShop(req): Observable<any> {
    return this.communicationService.post(this.urls.api['shop'] + '/subscription/' + req.id, {});
  }

  // HTTP Call for Get Shop
  deleteShop(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['shop'] + '/' + req.id);
  }

  getShopsWithPageData(params, sub_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query ; // Object.assign({}, defaults, params);

    const url = this.urls.api['shop'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit

    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
      {'name' : {'$regex': '.*' + params + '*.', '$options' : 'i'} } ]}});
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});
    } else {
      query = Object.assign({}, query, {search : {sub_id: sub_id}});
    }

    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    if (typeof(params) === 'string') {
      return this.communicationService.postSearch(url, param);
    } else {
      return this.communicationService.post(url, param);
    }


  }
}
