import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationService } from '../../shared/services/communication.service';
import { Urls } from '../../shared/structures/urls';
@Injectable({
  providedIn: 'root'
})
export class CentralwarehouseproductService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }
  // HTTP Call for Save warehouseProduct
  saveWarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['centralWarehouseProducts'], req);
  }

  // HTTP Call for Update warehouseProduct
  updatewarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['centralWarehouseProducts'] + '/' + req.id, req);
  }

  // HTTP Call for Get warehouseProduct
  getwarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['centralWarehouseProducts'] + '/' + req.id);
  }

  // HTTP Call for Delete warehouseProduct
  deletewarehouseProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['centralWarehouseProducts'] + '/' + req.id);
  }

  getwarehouseProductsWithPageData(params, cw_id) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['centralWarehouseProducts'] + '/search';

    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'central_warehouse_id' : { '$eq' : cw_id } },
         {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} } ]}});
    } else {
      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }
    query = Object.assign({}, query, {search : {central_warehouse_id: cw_id}});
    // query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + name + '.', '$options' : 'i'} }] }});
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

  appUpdateProductStock(req) {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['centralWarehouseProducts'] + '/' + req.productId + '/addUpdateStock', req);
  }

  deleteProductStock(req) {
    console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['centralWarehouseProducts'] + '/' + req.productId + '/deleteStock', req);
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

    const url = this.urls.api['centralWarehouseInventory'] + '/search';
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

    const url = this.urls.api['centralWarehouseShippingHistory'] + '/search';

    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
         {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} } ]}});
    } else {
      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }
      query = Object.assign({}, query, {search :
      {'central_warehouse_product_id' : { '$eq' : warehouse_product_id } } });
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
