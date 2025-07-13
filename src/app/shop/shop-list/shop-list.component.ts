import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ShopService } from '../shop.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';
import { Session } from 'src/app/shared/structures/session';
import { environment } from 'src/environments/environment';
import { WeezeventService } from '../weezevent.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ChannelService } from 'src/app/channel/channel.service';
import { DatasharingService } from './datasharing.service';
declare var $: any;

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit, OnDestroy, AfterViewInit {

  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'country']
  };
  environmentLocal = environment;
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  shops: any[];
  deleteRowId: '';
  shopSubscription: any;
  sub_id = '';
  webstroreurl = environment['WEBSTORE'] + '/webmail';
  isShowWeezeventFlag = false;
  isShowFermyntFlag = false;
  closeResult = '';
  typeOfEvent = '';
  subPlan = '';
  isSelectOption = false;
  channelList = [];
  totalChannel = -1;
  MAX_CHANNAL_ALLOWED_LIMIT = appConst.MAX_CHANNAL_ALLOWED_LIMIT;

  constructor(private appService: AppService, private store: Store<any>, private weezeventService: WeezeventService,
    private appToastrService: AppToastrService, private shopService: ShopService, private modalService: NgbModal,
  private channelService: ChannelService, private datasharingService: DatasharingService) { }

  ngOnInit() {
    this.headers = [
      { key: 'name', cansort: true, label: 'Shop Name' },
      { key: 'startDate', cansort: true, label: 'Start Date', type: 'date'},
      { key: 'endDate', cansort: true, label: 'End Date', type: 'date' },
      { key: 'country', cansort: true, label: 'Country' }
    ];
    this.actions = { edit: true, delete: true };
    this.shopSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.subPlan = s.appMainStore.subPlan;
    });
    this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: true } });
    this.getListOfChannels();
    this.reloadGrid(this.defaultParams);
    this.CheckWeezeventSettingForSub();
  }

  getListOfChannels() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: []
    };
    this.channelService.getChannelsWithPageData(defaultParams, this.sub_id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
          const channels = response.res.docs;
            this.channelList = channels.map((channel, index) => {
              const item = channel;
              if (index === 0) {
                item['isAdded'] = true;
              } else {
                item['isAdded'] = false;
              }
              return item;
          });
            this.totalChannel = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Channel detail failed to get.');
      });
  }

  addChannel(channel, idx) {
    this.channelList[idx]['isAdded'] = !this.channelList[idx]['isAdded'];
    return false;
  }

  ngAfterViewInit() {
    $('.printData').find('img').attr('style', 'margin:auto');
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/shop/new');
  }

  gotoWeezeventList() {
    this.appService.gotoURL('subscriptionhome/shop/weezeventlist');
  }

  tariffShopDetails(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/tariff');
  }

  goToShopTicket(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/eventtickets');
  }

  // QRPopup(printSectionId) {
  //   // console.log(printSectionId)
  //   let popupWinindow;
  //   const innerContents = document.getElementById(printSectionId).innerHTML;
  //   popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,
  // status = no, titlebar = no');
  //   popupWinindow.document.open();
  //   let html = '<html><head><style>#printData img{margin:  auto;    padding-top: 20px;}';
  //   html += '.changetxt {display: none}';
  //   html +=  '#printData {text-align: center;    padding: 20px;}</style></head>';
  //   html += '<body>' + innerContents + '</html>';
  //   popupWinindow.document.write(html);
  //   popupWinindow.document.close();
  //   return false;
  // }

  // this.modalService.dismissAll('Close popup after Save.');

  CheckWeezeventSettingForSub() {
    this.weezeventService.getSubscriptionWeezeventSetting({ sub_id: this.sub_id })
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          if (!!response.msg.access_token) {
            this.isShowWeezeventFlag = true;
            this.isShowFermyntFlag = false;
          } else {
            this.isShowWeezeventFlag = false;
            this.isShowFermyntFlag = true;
          }
        }
    },
    error => {
      // console.log(error);
      this.isShowWeezeventFlag = false;
      this.isShowFermyntFlag = true;
      if (!!error && !!error.error_code && error.error_code === 'ERR_WEEZEVENT_GET_102') {
        // Donothink
      } else {
        // this.appToastrService.showError(error.msg || 'Weezevent detail failed to get for the subscription.');
      }
    });
  }

  editShopDetails(shopId) {
    this.appService.gotoURL('subscriptionhome/shop/update/' + shopId);
  }

  reloadGrid(curparams) {
    this.gridstate = curparams;

    this.shopService.getShopsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          this.shops = response.res.docs;
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

  goToShopProduct(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
  }

  goToShopProductRevert(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({id: id, name: name});
    this.appService.gotoURL('subscriptionhome/shop/revertwarehouse');
  }

  goToShopVisiters(id, name) {
    this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
    Session.saveShop({ id: id, name: name });
    this.appService.gotoURL('subscriptionhome/shop/detailview/eventvisitors');
  }

  ngOnDestroy() {
    if (!!this.shopSubscription) {
      this.shopSubscription.unsubscribe();
    }
  }
  openTypeSelectionModal(content, typeOfEvent) {
    if (appConst.PRIVATE_EVENT_PLANS.indexOf(this.subPlan) !== -1) {
      this.typeOfEvent = typeOfEvent;
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        // console.log(this.closeResult);
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        // console.log(this.closeResult);
      });
    } else {
      if (typeOfEvent === 'fermynt') {
        this.createnew();
      } else if (typeOfEvent === 'weezevent') {
        this.gotoWeezeventList();
      }
   }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  proceedClick() {
    // console.log(this.isSelectOption);
    const channels = [];
    this.channelList.forEach((item) => {
      if (item.isAdded) {
        channels.push(item);
      }
    });
    this.datasharingService.changeMessage({ isPrivate: this.isSelectOption, channels: channels });
    this.modalService.dismissAll('Close popup after Save.');
    if (this.typeOfEvent === 'fermynt') {
      this.createnew();
    } else if (this.typeOfEvent === 'weezevent') {
      this.gotoWeezeventList();
    }
  }

}
