import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { AppService } from '../shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsubService {
constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save Product
  saveProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['product'], req);
  }

  // HTTP Call for Approval
  saveApproveProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['approve'], req);
  }

  // HTTP Call for Update Product
  updateProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['product'] + '/' + req.id, req);
  }

  // HTTP Call for Update Product
  updateApprovalProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['approve'] + '/' + req.id, req);
  }

  // HTTP Call for Get Product
  getProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['product'] + '/' + req.id);
  }

  // HTTP Call for Get Product
  getApprovalProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['approve'] + '/' + req.id);
  }

  // HTTP Call for delete Product
  deleteProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['product'] + '/' + req.id);
  }

getProductsWithPageData(params, sub_id) {

  const defaults = {
    page: 1,
    limit: 10,
    sortkey: '',
    sortorderstring: 'desc',
    search: '',
    sort: ''
  };

  let query ;

  const url = this.urls.api['approve'] + '/search';
  if (typeof(params) === 'string') {
    query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} }] }});
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

  // query['search'] = Object.assign({}, query.search, {'$and' : [{ 'sub_id' : { '$eq' : sub_id } }] });
    query['search'] = Object.assign({}, query.search, {
      '$and': [
        {
          'sub_id': { '$eq': sub_id }
        },
        {
          'type': 'PRODUCT'
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

// HTTP Call for Get Wine
  getPendingProductsWithPageData(params, sub_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query ;

    const url = this.urls.api['approve'] + '/search';
    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} }] }});
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
        {
          'sub_id': { '$eq': sub_id }
        },
        {
          'type': 'PRODUCT'
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

getProductsWithPageDataWithGlobal(params, sub_id) {

  const defaults = {
    page: 1,
    limit: 10,
    sortkey: '',
    sortorderstring: 'desc',
    search: '',
    sort: ''
  };

  let query ;

  const url = this.urls.api['product'] + '/search';
  if (typeof(params) === 'string') {
    query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} }] }});
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

  // query['search'] = Object.assign({}, query.search, {'$or' : [{ 'sub_id' : { '$eq' : sub_id } }, { 'sub_id' : { '$eq' : '' } }] });
  query['search'] = Object.assign({}, query.search, { sub_id: { $in: [ sub_id, null] } });
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
