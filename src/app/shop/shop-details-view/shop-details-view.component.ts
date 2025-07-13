import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ShopService } from '../shop.service';
import { environment } from '../../../environments/environment';
import * as appAction from '../../action/app-actions';
import { Session } from './../../shared/structures/session';

@Component({
  selector: 'app-shop-details-view',
  templateUrl: './shop-details-view.component.html',
  styleUrls: ['./shop-details-view.component.scss']
})
export class ShopDetailsViewComponent implements OnInit, OnDestroy {

  environmentLocal = environment;
  shopId = '';
  shopModel: any;

  shopSubscription: any;
  isDisplay = false;
  viewType = 'products';
  currentPath = '';
  webstroreurl = environment['WEBSTORE'] + '/webmail';

  constructor(public appService: AppService, private store: Store<any>, private router: Router,
    private route: ActivatedRoute, private appToastrService: AppToastrService, private shopservice: ShopService) {}

  ngOnInit() {

    this.shopModel = {
      sub_id: '',
      name: '',
      description: '',
      url: '',
      email: '',
      picture: '',
      startDate: '',
      endDate:  '',
      mobile: '',
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      country_code: '',
      event_id: '',
      logo: '',
      cust_mob_evt_show: false,
      geofencing_radius: 0,
      currency: {},
      timezone: '',
      site: '',
      longitude: '',
      latitude: '',
      payment_webshop: {
        cust_pay_at_till_flag: true,
        cust_pay_flag: false,
        cust_pay_and_settle_flag: false,
      },
      payment_mobile: {
        cust_pay_at_till_flag: true,
        cust_pay_flag: false,
        cust_pay_and_settle_flag: false,
      },
      shop_type: '',
      pricing_flag: true,
      order_transaction_flag: true,
      cart_flag: true,
      prof_type: '',
      prof_domain: '',
      score_range: 0,
      isWeezEvent: false,
      weezEventId: '',
      tickets: [],
      ticket_groups: [],
      isPrivate: false,
      location_code: '',
      organiser_name: '',
      channels: []
    };

    this.shopSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.shopModel.sub_id = s.appMainStore.subscriptionId;
      this.shopId = s.appMainStore.shopId;
    });
    this.currentPath = this.router.url;
    this.getShopIdDetail();
    if (this.currentPath.indexOf('eventtickets') !== -1) {
      this.viewType = 'tickets';
    } else if (this.currentPath.indexOf('eventvisitors') !== -1) {
      this.viewType = 'visitors';
    } else if (this.currentPath.indexOf('eventstatistics') !== -1) {
      this.viewType = 'statistics';
    } else if (this.currentPath.indexOf('eventorders') !== -1) {
      this.viewType = 'orders';
    } else {
      this.viewType = 'products';
    }
    // if (this.route.snapshot.params['id']) {
    //   this.shopId = this.route.snapshot.params['id'];
    //   this.getShopIdDetail();
    // }
    // if (this.route.snapshot.params['type']) {
    //   this.viewType = this.route.snapshot.params['type'].toLowerCase();
    //   this.getShopIdDetail();
    // }
  }

  getShopIdDetail() {
    this.shopservice.getShop({id: this.shopId})
    .subscribe(
      (response: any) => {
      if (response.status === 'success') {
        this.isDisplay = true;
        this.shopModel = Object.assign({}, this.shopModel, response.msg);
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      this.appToastrService.showError(error.msg || 'Event detail failed to get.Please try agian later.');
    });
  }

  goToShopProduct(id, name) {
    this.viewType = 'products';
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
  }

  tariffShopDetails(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/tariff');
  }

  editShopDetails(shopId) {
    this.appService.gotoURL('subscriptionhome/shop/update/' + shopId);
  }

  goToShopTicket(id, name) {
    this.viewType = 'tickets';
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/eventtickets');
  }

  goToShopVisiters(id, name) {
    this.viewType = 'visitors';
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/eventvisitors');
  }

  goToShopStatistics(id, name) {
    this.viewType = 'statistics';
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
  }

  goToShopOrders(id, name) {
    this.viewType = 'orders';
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
  }

  ngOnDestroy() {
    if (!!this.shopSubscription) {
      this.shopSubscription.unsubscribe();
    }
  }

}
