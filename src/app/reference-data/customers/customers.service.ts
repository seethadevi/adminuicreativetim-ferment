
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationService } from './../../shared/services/communication.service';
import { Urls } from './../../shared/structures/urls';
import { AppService } from './../../shared/services/app.service';
@Injectable()
export class CustomersService {
  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }
  // HTTP Call for Save Customer
  saveCustomer(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['customer'], req);
  }
  // HTTP Call for Save Customer
  saveContact(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['contact'], req);
  }
  checkCustomerExist(req): Observable<any> {
    return this.communicationService.post(this.urls.api['customer'] + '/checkCustomer', req);
  }
  // HTTP Call for Update Customer
  updateCustomer(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['customer'] + '/' + req.id, req);
  }
  // HTTP Call for Get Customer
  getCustomers(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['customer'] + '/' + req.id);
  }
  // HTTP Call for delete Customer
  deleteCustomer(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['customer'] + '/' + req.id);
  }
  getCustomersWithPageData(params) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    const query = Object.assign({}, defaults, params);
    const url = this.urls.api['customer'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
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
      query['search'] = { '$or': search };
    }
    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };
    return this.communicationService.post(url, param);
  }
  getCustomersWithPageDataSub(params, sub_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    const query = Object.assign({}, defaults, params);
    const url = this.urls.api['subscription'] + '/customers/search'; // + "?page=" + query.page + "&limit=" + query.limit
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
      query['search'] = { '$or': search };
    }
    // query['search'] = Object.assign({}, query.search, { '$and': [{ 'sub_id': { '$eq': sub_id } }] });
    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search,
      sub_id: sub_id
    };
    return this.communicationService.post(url, param);
  }
}

