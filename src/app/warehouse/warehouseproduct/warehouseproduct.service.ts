import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationService } from '../../shared/services/communication.service';
import { Urls } from '../../shared/structures/urls';
import { AppService } from '../../shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class WarehouseproductService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  getMyPhotos(page: number) {
    return this.communicationService.get('https://jsonplaceholder.typicode.com/photos?_page=' + page);
  }


  // HTTP Call for Save warehouseProduct
  saveWarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['warehouseproduct'], req);
  }

  // HTTP Call for Update warehouseProduct
  updatewarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['warehouseproduct'] + '/' + req.id, req);
  }

  // HTTP Call for Get warehouseProduct
  getwarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['warehouseproduct'] + '/' + req.id);
  }

  // HTTP Call for Get warehouseProduct
  getwarehouseProductCenter(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['warehouseproduct'] + '/product/' + req.id);
  }

  // HTTP Call for Delete warehouseProduct
  deletewarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['warehouseproduct'] + '/' + req.id);
  }

  getwarehouseProductsWithPageData(params, sub_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['warehouseproduct'] + '/search';

    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
         {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} } ]}});
    } else {
    //   if (query.sortorderstring === 'desc') {
    //     query['sort'] = -1;
    //   }
    // query = Object.assign({}, query, {search : {sub_id: sub_id}});
    // query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + name + '.', '$options' : 'i'} }] }});
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }
    if (query.searchvalue.length > 1 && !!query.searchelems.length) {
      const search = [];
      query.searchelems.map((item) => {
        search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
      });
      // console.log(search);
      query['search'] = { '$and': [ { 'sub_id' : sub_id  }, { '$or':  search } ] };
      // query['search'] = { '$or':  search, sub_id: sub_id };
    } else {
      query = Object.assign({}, query, {search : {sub_id: sub_id}});
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

  getwarehouseProductsWithStock(params, sub_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['warehouseproduct'] + '/search';

    query = Object.assign({}, query, {search : { '$and': [ { sub_id: { '$eq' : sub_id } },
    { stock_availability: { $gt : 0 }} ]}});

    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    const param = {
      page: !!query.page ? query.page : 1,
      limit: !!query.limit ? query.limit : 10,
      sort: !!query.sort ? query.sort : 1,
      search: query.search
    };
    return this.communicationService.post(url, param);
  }

  appUpdateProductStock(req) {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['warehouseproduct'] + '/' + req.productId + '/addUpdateStock', req);
  }

  centralappUpdateProductStock(req) {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['warehouseproduct'] + '/fermyntCentral/' + req.productId + '/addUpdateStock', req);
  }

  deleteProductStock(req) {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['warehouseproduct'] + '/' + req.productId + '/deleteStock', req);
  }

  getWHProdctInventoryWithPageData(params, whProdId) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['warehouseinventory'] + '/search';
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {warehouse_product_id: whProdId}});
    // query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + name + '.', '$options' : 'i'} }] }});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }

  getwarehouseProductsHistoryWithPageData(params, sub_id, warehouse_product_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['warehouseshippinghistory'] + '/search';

    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
         {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} } ]}});
    } else {
      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
      {'warehouse_product_id' : { '$eq' : warehouse_product_id } } ]}});
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
