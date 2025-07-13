import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';
import { AppService } from '../shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ShopproductListService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }
  // HTTP Call for Save ShopProduct
  saveShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['shopproducts'], req);
  }

  saveShopProductWithStock(req): Observable<any> {
    return this.communicationService.post(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id + '/shop/'
    + req.shop_id + '/' + req.warehouse_product_id + '/addStock', {'qty' : req.stock_availability.toString()});
  }

  // HTTP Call for Update ShopProduct
  updateShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['shopproducts'] + '/' + req.id, req);
  }

  // HTTP Call for Get ShopProduct
  getShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['shopproducts'] + '/' + req.id);
  }

  // HTTP Call for Get Sum od ShopProductCount
  getSumOfShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id + '/shop/' + req.shop_id, {});
  }

  // HTTP Call for Get Sum od ShopProductCount
  moveallProductToShop(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id +
    '/shop/' + req.shop_id + '/addStock', {});
  }

  moveSelectiveProductToShop(req, param): Observable<any> {
    return this.communicationService.put(this.urls.api['shopproducts'] + '/subscription/' + param.sub_id +
    '/shop/' + param.shop_id + '/addSelective', req);
  }

  moveSelectiveProductToShopStock(req, param): Observable<any> {
    return this.communicationService.put(this.urls.api['shopproducts'] + '/subscription/' + param.sub_id +
    '/shop/' + param.shop_id + '/addSelectiveWithStock', req);
  }

  moveSelectiveProductToShopWithoutStock(req, param): Observable<any> {
    return this.communicationService.put(this.urls.api['shopproducts'] + '/subscription/' + param.sub_id +
    '/shop/' + param.shop_id + '/addSelectiveWithoutStock', req);
  }

  // HTTP Call for Get ShopProduct
  getWHProductNotInShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id +
    '/warehouse/' + req.warehouse_id + '/shop/' + req.shop_id + '/list');
  }

  // HTTP Call for Get Sum od ShopProductCount
  moveallProductToWarehouse(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id +
    '/shop/' + req.shop_id + '/deleteStock', {});
  }
  // HTTP Call for Delete ShopProduct
  deleteShopProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['shopproducts'] + '/' + req.id);
  }

  getRecommendationsForProduct(req): Observable<any> {
    return this.communicationService.get(this.urls.api['recommendations'] + '/subscription/' + req.sub_id + '/shop/'
    + req.shop_id + '/product/' + req.warehouse_product_id);
  }

  createRecommendationsForProduct(req): Observable<any> {
    return this.communicationService.post(this.urls.api['recommendations'] , req);
  }
  updateRecommendationsForProduct(req, recommendationId): Observable<any> {
    return this.communicationService.put(this.urls.api['recommendations'] + '/' + recommendationId , req);
  }

  getShopProductsWithPageData(params, sub_id, shop_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['shopproducts'] + '/search';
    // if (query.sortorderstring === 'desc') {
    //   query['sort'] = -1;
    // }
    if (typeof(params) === 'string') {
      query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
      {'shop_id' : { '$eq' : shop_id } } ]}});
    } else {
      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }
      if (query.searchvalue.length > 1 && !!query.searchelems.length) {
        const search = [];
        query.searchelems.map((item) => {
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue, query.searchelemsType));
        });
         query['search'] = { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
         {'shop_id' : { '$eq' : shop_id } }, { '$or':  search } ] };
       } else {
        query = Object.assign({}, query, {search : { '$and': [ { 'sub_id' : { '$eq' : sub_id } },
        {'shop_id' : { '$eq' : shop_id } } ]}});
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

  appUpdateProductStock(req) {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['shopproducts'] + '/subscription/' + req.sub_id + '/shop/' +
     req.shopId + '/' + req.warehouse_product_id + '/updateStock' , {qty: req.quantity.toString()});
  }

  deleteProductStock(req) {
    // console.log('payload before service call', req);
    // return this.communicationService.delete(this.urls.api['shopinventory'] + '/' + req.serial + '/deleteStock');
    return this.communicationService.put(this.urls.api['shopproducts'] + '/' + req.shop_product_id + '/deleteStock', req);
  }

  getShopProdctInventoryWithPageData(params, shopProdId) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['shopinventory'] + '/search';
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {shop_product_id: shopProdId}});
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
