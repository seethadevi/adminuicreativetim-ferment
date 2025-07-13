import { Injectable } from '@angular/core';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentralwarehouseService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save CentralWarehouse
  saveCentralWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['centralwarehouse'], req);
  }

  // HTTP Call for Update CentralWarehouse
  updateCentralWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['centralwarehouse'] + '/' + req.id, req);
  }

  // HTTP Call for Get CentralWarehouse
  getCentralWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['centralwarehouse'] + '/' + req.id);
  }

  // HTTP Call for Delete CentralWarehouse
  deleteCentralWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['centralwarehouse'] + '/' + req.id);
  }

  getCentralWarehousesWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['centralwarehouse'] + '/search';
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : ''});
    // query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + name + '.', '$options' : 'i'} }] }});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }
}
