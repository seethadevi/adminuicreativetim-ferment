import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/shared/structures/session';
import { SubscriptionService } from './../choosesubscription/subscription.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';
import { ShopService } from '../shop/shop.service';
declare const $: any;
import * as appConst from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-subscription-dashboard',
  templateUrl: './subscription-dashboard.component.html',
  styleUrls: ['./subscription-dashboard.component.scss']
})
export class SubscriptionDashboardComponent implements OnInit {

  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: []
  };
  subscriptions: any;
  getSubscription: any;
  sub_id: string;
  currSelectedSubscription: String;
  shops: any[];
  totalRecords = 0;
  constructor(private subscriptionService: SubscriptionService, private appToastrService: AppToastrService,
    private store: Store<any>, private appService: AppService, private shopService: ShopService) { }

  ngOnInit() {
    this.shops = [];
    this.getSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
        });
    this.getListOfEventShop();
  }

  getSubscriptionList() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.subscriptionService.getSubscriptionsWithPageData(this.defaultParams)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.subscriptions = response.res.docs;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Subscription detail failed to get.');
      });
  }

  getListOfEventShop() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ['name', 'country']
    };
    this.shopService.getShopsWithPageData(defaultParams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          const shops = response.res.docs;
          this.shops = shops.filter((shop) => {
            if (new Date(shop.endDate) >= new Date()) {
              return shop;
            }
          });
          this.totalRecords = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Shop detail failed to get.');
      });
  }

  gotoDetailEvent(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
  }

  gotoEditEvent(shopId) {
    this.appService.gotoURL('subscriptionhome/shop/update/' + shopId);
  }

  gotoCreateEvent() {
    this.appService.gotoURL('subscriptionhome/shop/new');
  }

  selectSubscription(id) {
    const name = this.subscriptions.find( (item) => {
      return item.id === id;
    });
    Session.saveSubscription({id: id, name: name.name, picture: name.picture});
    this.store.dispatch({type: appAction.SELECT_SUBSCRIPTION, payload: {id: id, name: name.name, picture: name.picture}});
    this.appService.gotoURL('/subscriptionhome');
  }
}


