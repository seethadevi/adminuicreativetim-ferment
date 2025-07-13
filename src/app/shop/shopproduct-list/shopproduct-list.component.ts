import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ShopproductListService } from '../shopproduct-list.service';
import * as appAction from '../../action/app-actions';
import { environment } from '../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-shopproduct-list',
  templateUrl: './shopproduct-list.component.html',
  styleUrls: ['./shopproduct-list.component.scss']
})
export class ShopproductListComponent implements OnInit, OnDestroy {
  defaultParams = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name'],
    searchelemsType: 'string'
  };
  shopProdSubscription: any;
  shopProducts: any[];
  sub_id = '';
  shop_id = '';
  shop_name = '';
  environmentLocal: any;
  searchString: any = '';
  showErrorMsg: boolean;
  errorMsg: string;
  loading = true;
  searchDropSelect = {name: 'All', attrName: 'all', type: 'string'};
  drops = [
    {name: 'All', attrName: 'all', type: 'string'},
    {name: 'Name', attrName: 'name', type: 'string'},
    {name: 'Region', attrName: 'attr.region.name', type: 'string'},
    {name: 'Producer', attrName: 'producer.name', type: 'string'},
    {name: 'Year', attrName: 'attr.year', type: 'number'}
  ];
  queryParams: any;
  totalRecords: number;
  totalPages: number;
  gridstate: any;
  deviceOS = null;
  constructor(private appService: AppService, private store: Store<any>,
    private appToastrService: AppToastrService, private shopproductListService: ShopproductListService
    , private deviceService: DeviceDetectorService) {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceOS = deviceInfo.os.toLowerCase();
    }

  ngOnInit() {
    this.showErrorMsg = false;
    this.shopProducts = [];
    this.environmentLocal = environment;
    this.shopProdSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.shop_id = s.appMainStore.shopId;
          this.shop_name = s.appMainStore.shopName;
    });
    this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: true } });
    this.gridstate = this.defaultParams;
    this.reloadGrid(this.defaultParams);
  }

  nextPage() {
    if (this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }

  onSearch(event) {
    if (this.searchString.length === 0) {
      this.showErrorMsg = false;
      this.reloadGrid(this.defaultParams);
    } else if (this.searchString.length > 2) {
      this.showErrorMsg = false;
      if (this.searchDropSelect === undefined) {
        this.searchDropSelect = this.drops[4];
      }
      this.gridstate.page = 1;
      this.gridstate.pages = 1;
      this.gridstate.searchvalue = this.searchString;

      if (this.searchDropSelect.name === 'All') {
        const searchelems = [];
        for  (let i = 0; i < this.drops.length; i++) {
          if (this.drops[i].attrName !== 'all') {
            searchelems.push(this.drops[i].attrName);
          }
        }
        this.gridstate.searchelems = searchelems;
      } else {
        this.gridstate.searchelems = [this.searchDropSelect.attrName];
        this.gridstate.searchelemsType = this.searchDropSelect.type;
      }
      this.reloadGridSearch(this.gridstate);
    } else {
      this.showErrorMsg = true;
      this.errorMsg = 'Minimum 3 characters required for search';
    }
  }

  loadDropBtn(elem, val) {
    this.searchDropSelect = val;
    this.searchString = '';
  }

  ngOnDestroy() {
    if (!!this.shopProdSubscription) {
      this.shopProdSubscription.unsubscribe();
    }
  }


  reloadGridSearch(curparams) {

    this.shopproductListService.getShopProductsWithPageData(curparams, this.sub_id, this.shop_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === 'success') {
            const resDocs = response.res.docs;
            this.shopProducts = resDocs;
            this.totalRecords = response.res.total;
            this.totalPages = response.res.pages;
            this.gridstate['pages'] = response.res.pages;
            this.gridstate['total'] = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Shop Product detail failed to get.');
      });
  }
  reloadGrid(curparams) {

    this.shopproductListService.getShopProductsWithPageData(curparams, this.sub_id, this.shop_id)
      .subscribe(
        (response: any) => {
          this.loading = false;
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.shopProducts = this.shopProducts.concat(resDocs);
          this.totalRecords = response.res.total;
          this.totalPages = response.res.pages;
          this.gridstate['pages'] = response.res.pages;
          this.gridstate['total'] = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Shop Product detail failed to get.');
      });
  }

  editShopProduct(prodId) {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproduct/update/' + prodId);
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproduct/new');
  }

  createAll() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproduct/warehouse/all');
  }

  createSelective() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproduct/warehouse/selective');
  }

  gotoShop() {
    this.appService.gotoURL('subscriptionhome/shop');
  }

  addProductToRecommendation() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproduct/recommendations/' + this.shop_id);
  }

}
