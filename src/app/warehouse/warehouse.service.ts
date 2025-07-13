import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Warehouse
 saveWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['warehouse'], req);
  }

  // HTTP Call for Update Warehouse
  updateWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['warehouse'] + '/' + req.id, req);
  }

  // HTTP Call for Get Warehouse
  getWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['warehouse'] + '/' + req.id);
  }

  // HTTP Call for Delete Warehouse
  deleteWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['warehouse'] + '/' + req.id);
  }

  getWarehousesWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['warehouse'] + '/search';
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {sub_id: sub_id}});
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
