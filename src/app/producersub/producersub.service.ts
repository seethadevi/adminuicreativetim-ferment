import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Urls } from './../shared/structures/urls';
import { CommunicationService } from './../shared/services/communication.service';
import { AppService } from './../shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProducersubService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save Winery
  saveWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['winery'], req);
  }

  // HTTP Call for Save Winery
  saveApprovalWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['approve'], req);
  }

  // HTTP Call for Update Winery
  updateWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['winery'] + '/' + req.id, req);
  }

  // HTTP Call for Update Winery
  updateApprovalWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['approve'] + '/' + req.id, req);
  }

    // HTTP Call for Update Product
    updateApprovalWineryStatus(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['approve'] + '/status/' + req.id, req);
  }


  // HTTP Call for Get Winery
  getWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['winery'] + '/' + req.id);
  }

  // HTTP Call for Get Winery
  getApprovalWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['approve'] + '/' + req.id);
  }
  // HTTP Call for delete Winery
  deleteWinery(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['winery'] + '/' + req.id);
  }
  getWinerysWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    let query;
    const url = this.urls.api['approve'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
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
          // searchJSON = '{' + item + ':' +  '{' + '$regex:' + '.*' + query.searchvalue + '.*,' + '$options:' + 'i' + '}' + '}');
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
        });
        // console.log(search);
        query['search'] = { '$or':  search };
      }
    }
    query['search'] = Object.assign({}, query.search, {
      '$and': [
        { 'sub_id': { '$eq': sub_id } },
        {
          'type': 'PRODUCER'
        },
        {
          'status': 'APPROVED'
        }
      ]
    });
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

  getApprovalWinerysWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    let query;
    const url = this.urls.api['approve'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
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
          // searchJSON = '{' + item + ':' +  '{' + '$regex:' + '.*' + query.searchvalue + '.*,' + '$options:' + 'i' + '}' + '}');
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
        });
        // console.log(search);
        query['search'] = { '$or':  search };
      }
    }
    query['search'] = Object.assign({}, query.search, {
      '$and': [
        { 'sub_id': { '$eq': sub_id } },
        {
          'type': 'PRODUCER'
        },
        {
          'status': 'WAITING_LIST'
        }
      ]
    });
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
