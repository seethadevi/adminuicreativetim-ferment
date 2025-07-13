import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';
import { AppService } from '../shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ShopTariffService {

  constructor(private urls: Urls, private communicationService: CommunicationService,
    private appService: AppService) { }

  // HTTP Call for Save Tariff
  saveTariff(req, shop_id): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['eventTickets'] + '/tariff/shop/' + shop_id, req);
  }

  // HTTP Call for Update Tariff
  updateTariff(req, shop_id): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['eventTickets'] + '/tariff/shop/' + shop_id, req);
  }

  // HTTP Call for Get Tariff
  getTariff(shop_id): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['eventTickets'] + '/tariff/shop/' + shop_id);
  }

  getTariffPageData(param) {

  }

  getEventTicketWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: '',
      searchvalue: ''
    };
    let query;
    const url = this.urls.api['eventTickets'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (typeof (params) === 'string') {
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});

    } else {
      query = Object.assign({}, defaults, params);

      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }

      // if (query.searchvalue.length > 1 && !!query.searchelems.length) {
      //   const search = [];
      //   query.searchelems.map((item) => {
      //     // searchJSON = '{' + item + ':' +  '{' + '$regex:' + '.*' + query.searchvalue + '.*,' + '$options:' + 'i' + '}' + '}');
      //     search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
      //   });
      //   // console.log(search);
      //   query['search'] = { '$or': search };
      // }

      if (query.searchvalue.length > 1 && !!query.searchelems.length) {
        const search = [];
        query.searchelems.map((item) => {
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
        });
         query['search'] = { '$and': [ { 'sub_id' : { '$eq' : query.sub_id } },
         {'shop_id' : { '$eq' : query.shop_id } }, { '$or':  search } ] };
       } else {
        query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : query.sub_id } },
        {'shop_id' : { '$eq' : query.shop_id } } ]}});
      }
    }


    const param = {
      page: !!query.page ? query.page : 1,
      limit: !!query.limit ? query.limit : 10,
      sort: !!query.sort ? query.sort : 1,
      search: query.search
    };

    if (typeof (params) === 'string') {
      return this.communicationService.postSearch(url, param);
    } else {
      return this.communicationService.post(url, param);
    }
  }
  getEvenVisitersWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: '',
      searchvalue: ''
    };
    let query;
    const url = this.urls.api['eventCustomer'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (typeof (params) === 'string') {
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});
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
        query['search'] = { '$or': search };
      }
    }

    const param = {
      page: !!query.page ? query.page : 1,
      limit: !!query.limit ? query.limit : 10,
      sort: !!query.sort ? query.sort : 1,
      search: query.search,
      sub_id: !!query.sub_id ? query.sub_id : '',
      shop_id: !!query.shop_id ? query.shop_id : ''
    };

    if (typeof (params) === 'string') {
      return this.communicationService.postSearch(url, param);
    } else {
      return this.communicationService.post(url, param);
    }
  }
}
