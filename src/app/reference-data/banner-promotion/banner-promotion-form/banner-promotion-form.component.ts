import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { LocationService } from '../../location/location.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Urls } from 'src/app/shared/structures/urls';
import { BannerPromotionService } from '../banner-promotion.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubscriptionService } from 'src/app/choosesubscription/subscription.service';
import { ShopService } from 'src/app/shop/shop.service';
import * as appConst from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-banner-promotion-form',
  templateUrl: './banner-promotion-form.component.html',
  styleUrls: ['./banner-promotion-form.component.scss']
})
export class BannerPromotionFormComponent implements OnInit, OnDestroy {

  endDate: any;
  startDate: any;
  bannerModel: any;
  isEdit = false;
  title = 'Add';
  bannerId: '';
  imgUploadUrl = '';
  thumbnailurlLogo = '';
  thumbnailurlBanner = '';
  countryList: any[];
  bannerSubscription: any;
  codeList: any;
  subscriptionList = [];
  eventList = [];
  sel_sub_id = '';
  sel_event = '';
  listOfTabString = ['EVENT', 'WEBLINK', 'DEFAULT'];
  btnTitle = 'Save';
  currentPath = '';
  constructor(private route: ActivatedRoute, public appservice: AppService, private store: Store<any>,
    private locationService: LocationService, private appToastrService: AppToastrService, private urls: Urls,
    private bannerPromotionService: BannerPromotionService, private subscriptionService: SubscriptionService,
  private shopService: ShopService, private router: Router) {
      this.imgUploadUrl = this.urls.api['bannerPromationImage'];
      this.currentPath = this.router.url;
  }

  ngOnInit() {
    this.codeList = [];
    this.countryList = [];
    this.bannerModel = {
      name: '',
      location_code: '',
      country_code: '',
      action_type: 'EVENT',
      display_channel: 'MOBILE',
      picture: {},
      logo: {},
      evt_shop: {},
      weblink: '',
      startDate: '',
      endDate: '',
      isVisible: false,
      sortOrder: ''
    };
    this.getSubscriptionList();
    this.bannerSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.countryList = s.appMainStore.list_of_country;
    });
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.btnTitle = 'Update';
      this.title = 'Edit';
      this.bannerId = this.route.snapshot.params['id'];
      this.getBannerDetail();
    } else {

    }
  }

  setSelectedTab(tabStr) {
    this.bannerModel.action_type = tabStr;
  }

  ngOnDestroy() {
    if (!!this.bannerSubscription) {
      this.bannerSubscription.unsubscribe();
    }
  }

  getSubscriptionList() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: []
    };
    this.subscriptionService.getSubscriptionsWithPageData(defaultParams)
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.subscriptionList = response.res.docs;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError( error.msg || 'Subscription detail failed to get.');
    });
  }

  getSubEventList(set_event_selection) {
    const curparams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ['name', 'country']
    };
    this.shopService.getShopsWithPageData(curparams, this.sel_sub_id)
      .subscribe(
      (response: any) => {
          if (response.status === appConst.SUCCESS) {
          this.eventList = response.res.docs;
          if (!!set_event_selection) {
            this.sel_event = set_event_selection['id'];
          } else {
            this.bannerModel.evt_shop = {};
          }
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        this.appToastrService.showError(error.msg || 'Shop detail failed to get.');
      });
  }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
    if (!!this.bannerModel.country_code) {
      return this.locationService
      .getLocationsWithPageData(text$, this.bannerModel.country_code, true)
      .pipe(
        map(
          data => data
        )
      );
    }
   }

  onAddingCode(item: string) {
    this.bannerModel['location_code'] = item['code'];
  }

  onRemovingCode(item: string) {
    this.bannerModel['location_code'] = '';
  }

  onClearValue() {
    if (this.currentPath.indexOf('reference/bannerpromotion/new') !== -1) {
      this.appservice.gotoURL('/reference/bannerpromotion');
    } else {
      this.appservice.gotoURL('/reference/bannerpromotion/new');
    }
  }

  getBannerDetail() {
    this.bannerPromotionService.getBannerPromotion({id: this.bannerId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
          this.bannerModel = response.msg;
          this.endDate = this.bannerModel.endDate;
          this.startDate = this.bannerModel.startDate;
          this.codeList.push(this.bannerModel.location_code);
          // this.thumbnailurlLogo = !!response.msg.logo ? response.msg.logo['sm'] : '';
          // this.thumbnailurlBanner = !!response.msg.picture ? response.msg.picture['sm'] : '';
          if (!!response.msg.picture) {
            this.thumbnailurlBanner = response.msg.picture['sm'];
          } else {
            this.thumbnailurlBanner = '';
            this.bannerModel.picture = {};
          }

          if (!!response.msg.logo) {
            this.thumbnailurlLogo = response.msg.logo['sm'];
          } else {
            this.thumbnailurlLogo = '';
            this.bannerModel.logo = {};
          }

          if (this.bannerModel.action_type === 'EVENT') {
            this.sel_sub_id = this.bannerModel.evt_shop['sub_id'];
            this.getSubEventList(this.bannerModel.evt_shop);
            this.bannerModel.weblink = '';
          } else if (this.bannerModel.action_type === 'WEBLINK') {
            this.bannerModel.weblink = this.bannerModel.weblink;
            this.bannerModel.evt_shop = {};
          } else if (this.bannerModel.action_type === 'DEFAULT') {
            this.bannerModel.evt_shop = {};
            this.bannerModel.weblink = '';
          }
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Banner detail failed to get.Please try agian later.');
    });
  }

  onFileUploadEventBanner(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.bannerModel.picture = '';
    } else {
      this.bannerModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  onFileUploadEventLogo(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.bannerModel.logo = '';
    } else {
      this.bannerModel.logo = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  displayEventDetail() {
    const indexPosition = this.eventList.findIndex((item) =>
        item.id === this.sel_event
    );
    // console.log(this.sel_event);
    this.bannerModel.evt_shop = {
      id: this.eventList[indexPosition]['id'],
      name: this.eventList[indexPosition]['name'],
      logo: this.eventList[indexPosition]['logo'],
      picture: this.eventList[indexPosition]['picture'],
      endDate: this.eventList[indexPosition]['endDate'],
      startDate: this.eventList[indexPosition]['startDate'],
      country_code: this.eventList[indexPosition]['country_code'],
      location_code: this.eventList[indexPosition]['location_code'],
      address: this.eventList[indexPosition]['address'],
      sub_id: this.sel_sub_id
    };
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
  onSubmit(f: NgForm) {
    this.bannerModel.endDate = this.endDate;
    this.bannerModel.startDate = this.startDate;


    if (this.bannerModel.action_type === 'WEBLINK' && this.bannerModel.weblink === '') {
      return false;
    } else if (this.bannerModel.action_type === 'EVENT' && this.isEmptyObject(this.bannerModel.evt_shop)) {
      return false;
    } else if (this.bannerModel.action_type === 'DEFAULT') {
      // Do nothing
    }
    // console.log(this.bannerModel);
    if (!!this.bannerModel.name && !!this.bannerModel.country_code && !!this.bannerModel.startDate
      && !!this.bannerModel.endDate && (this.bannerModel.picture !== 'undefined' &&
        !this.isEmptyObject(this.bannerModel.picture)) && !!this.bannerModel.location_code) {
      if (this.bannerModel.action_type === 'WEBLINK') {
        this.bannerModel.evt_shop = {};
      } else if (this.bannerModel.action_type === 'EVENT') {
        this.bannerModel.weblink = '';
      } else if (this.bannerModel.action_type === 'DEFAULT') {
        this.bannerModel.evt_shop = {};
        this.bannerModel.weblink = '';
      }
      if (!this.isEdit) {
        this.saveBanner();
      } else {
        const newModel = Object.assign({}, this.bannerModel, { id: this.bannerId });
        this.updateBanner(newModel);
      }
    }
  }

  saveBanner() {
    this.bannerPromotionService.saveBannerPromotion(this.bannerModel)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
        } else {
          if (!!response['errors']) {
            let errorHtml = '<ul>';
            Object.keys(response['errors']).map((item) => {
              errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            });
            errorHtml += '</ul>';
            this.appToastrService.typeCustom(errorHtml);
          } else {
            this.appToastrService.showError(response.msg);
          }
        }
      },
      error => {
        // console.log(error);
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Banner detail failed to save.Please try again later.');
      });
  }

  updateBanner(updateBanner) {
    this.bannerPromotionService.updateBannerPromotion(updateBanner)
    .subscribe(
    (response: any) => {
      // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        if (!!response['errors']) {
            let errorHtml = '<ul>';
            Object.keys(response['errors']).map((item) => {
              errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            });
            errorHtml += '</ul>';
            this.appToastrService.typeCustom(errorHtml);
          } else {
            this.appToastrService.showError(response.msg);
          }
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Banner detail failed to update.Please try agian later.');
    });
  }

}
