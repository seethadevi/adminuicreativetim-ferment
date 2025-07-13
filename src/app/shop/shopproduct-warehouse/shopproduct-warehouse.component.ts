import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AppService } from '../../shared/services/app.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ShopproductListService } from '../shopproduct-list.service';
import * as appAction from '../../action/app-actions';
import { WarehouseproductService } from '../../warehouse/warehouseproduct/warehouseproduct.service';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shopproduct-warehouse',
  templateUrl: './shopproduct-warehouse.component.html',
  styleUrls: ['./shopproduct-warehouse.component.scss']
})
export class ShopproductWarehouseComponent implements OnInit, OnDestroy {

  shopProdctSubscription: any;
  sub_id = '';
  warehouse_id = '';
  shop_id = '';
  shop_name = '';
  loadingCheck = false;
  total_sum_shopprod_count = 0;
  shopProductslist: any[];
  public moveShopProductList: any[];
  public moveWarehouseProductList: any[];
  public subs = new Subscription();
  environmentLocal: any;
  moveProductStock = false;
  isMoveClicked = false;
  onPageLoading = false;
  activeIdString = 'multipleProduct';

  @ViewChild('moveSwalSubscription', { static: false}) private moveSwalSubscription: SwalComponent;
  @ViewChild('moveWithoutStock', {static: false}) private moveWithoutStock: SwalComponent;
  @ViewChild('moveWithStock', {static: false}) private moveWithStock: SwalComponent;

  constructor(private appService: AppService, private shopproductListService: ShopproductListService,
    private appToastrService: AppToastrService, private store: Store<any>, public dragulaService: DragulaService,
    private warehouseproductService: WarehouseproductService,  private route: ActivatedRoute) {


      this.dragulaService.createGroup('MOVEWHSHOPPRODUCT', {
        // ...
      });

      this.dragulaService.dropModel('MOVEWHSHOPPRODUCT').subscribe(args => {
        // console.log(args);
      });

    }

  ngOnInit() {
    this.environmentLocal = environment;
    this.moveWarehouseProductList = [];
    this.moveShopProductList = [];
    this.shopProdctSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.warehouse_id =  s.appMainStore.warehouseId;
          this.shop_id = s.appMainStore.shopId;
          this.shop_name = s.appMainStore.shopName;
        });
    if (this.route.snapshot.params['option']) {
      if (this.route.snapshot.params['option'].toLowerCase() === 'all') {
        this.activeIdString = 'allproduct';
      }
    }
    this.shopProductslist = [];
    this.getAllWarehouseProductNotInShop();
    this.getAllShopProductList();

  }

  ngOnDestroy() {
    this.dragulaService.destroy('MOVEWHSHOPPRODUCT');
    this.subs.unsubscribe();
  }

  openConfirmation() {
    this.moveSwalSubscription.fire();
  }

  moveAllProducts() {
  //  console.log('click');
   this.loadingCheck = true;
   this.shopproductListService.moveallProductToShop({'sub_id': this.sub_id, 'shop_id': this.shop_id})
      .subscribe(
      (response: any) => {
        this.loadingCheck = false;
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
        } else {
          this.appToastrService.showError(response.msg);
        }
        this.gotoShopProduct();
      },
      error => {
        this.loadingCheck = false;
        this.gotoShopProduct();
        this.appToastrService.showError(error.msg || 'Failed to get Shop Product count.');
      });
  }

  showConfirmWindow() {
    if (!!this.moveShopProductList.length) {
      this.isMoveClicked = false;
      if (this.moveProductStock) {
        this.moveWithStock.fire();
      } else {
        this.moveWithoutStock.fire();
      }
    } else {
      this.isMoveClicked = true;
    }
  }

  moveProductToShop() {
    const reqObject = {
      products: [],
    };
    // console.log(this.moveShopProductList);

    if (!!this.moveShopProductList.length) {

      const selectedProdObject = this.moveShopProductList.map((item) => {
        return {
          prod_id : item.prod_id,
          warehouse_id: this.warehouse_id
        };
      });

      reqObject['products'] = selectedProdObject;
      // console.log(reqObject);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      if (this.moveProductStock) {
        this.moveToShopWithStock(reqObject);
      } else {
        this.moveToShopWithoutStock(reqObject);
      }
    } else {
      return false;
    }
  }

  moveToShopWithStock(reqObject) {
    this.shopproductListService.moveSelectiveProductToShopStock(reqObject, { sub_id: this.sub_id, shop_id: this.shop_id})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
        this.gotoShopProduct();
      } else {
        this.appToastrService.showError(response.msg);
      }
     },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Failed to Move Product to Shop.');
    });
  }

  moveToShopWithoutStock(reqObject) {
    this.shopproductListService.moveSelectiveProductToShopWithoutStock(reqObject, { sub_id: this.sub_id, shop_id: this.shop_id})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
        this.gotoShopProduct();
      } else {
        this.appToastrService.showError(response.msg);
      }
     },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Failed to Move Product to Shop.');
    });
  }

  onCloseDialog(event) {
    this.loadingCheck = false;
    // console.log("Swal Dialog Closed");
  }

  gotoShopProduct() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
  }


  getAllShopProductList() {
    // console.log('this.sub_id-5c715ece4567933a37be0b73')
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    const defaultParams = {
      page: 1,
      limit: 1000,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ''
    };
    // this.warehouseproductService.getwarehouseProductsWithStock(defaultParams, this.sub_id)
    this.shopproductListService.getShopProductsWithPageData(defaultParams, this.sub_id, this.shop_id)
      .subscribe(
      (response: any) => {
          if (response.status === 'success') {
          this.shopProductslist = response.res.docs;
          this.moveShopProductList = this.shopProductslist;
          // this.moveWarehouseProductList = response.res.docs;
          if (this.shopProductslist.length) {
            let cnt = 0;
            this.shopProductslist.map((item) => {
              cnt = parseInt(item['stock_availability'], 10) + cnt;
            });
            this.total_sum_shopprod_count = cnt;
          } else {
            this.total_sum_shopprod_count = 0;
            // this.appToastrService.showError('Stock is not available in warehouse');
          }
        } else {
          this.total_sum_shopprod_count = 0;
          this.appToastrService.showError(response.msg);
        }
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        // console.log(error);
        this.total_sum_shopprod_count = 0;
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Shop Product detail failed to get.');
      });
  }

  getAllWarehouseProductNotInShop() {
    this.shopproductListService.getWHProductNotInShopProduct({ sub_id: this.sub_id, warehouse_id: this.warehouse_id, shop_id: this.shop_id})
      .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.moveWarehouseProductList = response.msg;
          if ( response.msg.length === 0 ) {
            this.onPageLoading = true;
          }
        } else {
           this.appToastrService.showError(response.msg);
        }
       },
      error => {
        // console.log(error);
          this.appToastrService.showError(error.msg || 'Failed to get warehosue product.');
      });
  }

}
