import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';

@Injectable()
export class ProductService {
  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Product
  saveProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['product'], req);
  }
  // HTTP Call for Update Product
  updateProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['product'] + '/' + req.id, req);
  }
  // HTTP Call for Get Product
  getProducts(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['product'] + '/' + req.id);
  }
  // HTTP Call for delete Product
  deleteProduct(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['product'] + '/' + req.id);
  }
  getProductsWithPageData(params) {
    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    const query = Object.assign({}, defaults, params);
    const url = this.urls.api['product'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }
    if (query.searchvalue.length > 1) {
      query['search'] = query.searchvalue;
    }
    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };
    return this.communicationService.post(url, param);
  }
}
