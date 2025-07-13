import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopDashboardService {


  constructor(private urls: Urls, private communicationService: CommunicationService) {
  }

  getShopTotalSales(req , shop_id): Observable<any> {
    return this.communicationService.post(this.urls.api['customerOrder'] + '/totalSales/shop/' + shop_id, req);
  }

  getShopRegisteredCustomer(req , sub_id): Observable<any> {
    return this.communicationService.post(this.urls.api['customer'] + '/registered/' + sub_id, req);
  }

  getCategoryBasedOrders(req , shop_id): Observable<any> {
    return this.communicationService.post(this.urls.api['customerOrder'] + '/category/shop/' + shop_id, req);
  }

  getCustomerBasedOnShop(req, shop_id): Observable<any> {
    return this.communicationService.post(this.urls.api['customer'] + '/shop/' + shop_id, req);
  }

  getTopSellingProducts(params, shop_id): Observable<any> {
    const defaults = {
      page: 1,
      limit: 5,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: {'totalAmount': -1}
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['customerOrder'] + '/shop/' + shop_id;

    if (!!params.searchvalue) {
      query = Object.assign({}, defaults, { search : {'start': params['searchvalue']['start'], 'end': params['searchvalue']['end']} });
    }

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }

  // HTTP Call for Save Shop
   getShopSalesDetails(params , shop_id): Observable<any> {
     const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    const query = Object.assign({}, defaults, params);

    const url = this.urls.api['customerOrder'] + '/shop/' + shop_id;

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
    }
}

