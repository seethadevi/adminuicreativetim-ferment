import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';
import { AppService } from './../../shared/services/app.service';

@Injectable()
export class VineyardService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save Vineyard
  saveVineyard(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['vineyard'], req);
  }

  // HTTP Call for Update Vineyard
  updateVineyard(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['vineyard'] + '/' + req.id, req);
  }

  // HTTP Call for Get Vineyard
  getVineyards(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['vineyard'] + '/' + req.id);
  }

  // HTTP Call for delete Vineyard
  deleteVineyard(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['vineyard'] + '/' + req.id);
  }

  getVineyardsWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    let query;
    const url = this.urls.api['vineyard'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (typeof(params) === 'string') {
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});
      query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + params + '.', '$options' : 'i'} }] }});
    } else {
      query = Object.assign({}, defaults, params);
      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }

      if (query.searchvalue.length > 1 && !!query.searchelems.length) {
        const search = [];
        query.searchelems.map((item) => {
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
        });
        // console.log(search);
        query['search'] = { '$or':  search };
      }
    }

    const param = {
      page: !!query.page ? query.page : 1,
      limit: !!query.limit ? query.limit : 10,
      sort: !!query.sort ? query.sort : 1,
      search: query.search
    };

    if (typeof(params) === 'string') {
      return this.communicationService.postSearch(url, param);
    } else {
      return this.communicationService.post(url, param);
    }

  }

}
