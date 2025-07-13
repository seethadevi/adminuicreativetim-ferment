import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { ShopproductListService } from '../shopproduct-list.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { WarehouseproductService } from '../../warehouse/warehouseproduct/warehouseproduct.service';
import { DragulaService } from 'ng2-dragula';
import * as appAction from '../../action/app-actions';
import { environment } from '../../../environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Session } from './../../shared/structures/session';

@Component({
  selector: 'app-shopproduct-addrecommendations',
  templateUrl: './shopproduct-addrecommendations.component.html',
  styleUrls: ['./shopproduct-addrecommendations.component.scss']
})
export class ShopproductAddrecommendationsComponent implements OnInit, OnDestroy {
  selectedProduct: any;
  recommendationId: any;
  shopProdctSubscription: any;
  sub_id = '';
  warehouse_id = '';
  shop_id = '';
  shopProductsRecommendationslist: any[];
  shopProductsDropDownlist: any[];
  public moveShopProductRecommendationsList: any[];
  public moveWarehouseProductList: any[];
  moveProductStock = false;
  isMoveClicked = false;
  onPageLoading = false;
  environmentLocal: any;
  total_sum_wh_count = 0;
  shop: any;
  loading: boolean;
  @ViewChild('moveWithoutStock', {static : true}) private moveWithoutStock: SwalComponent;
  @ViewChild('moveWithStock', {static : true}) private moveWithStock: SwalComponent;

  constructor(private appService: AppService, private shopproductListService: ShopproductListService,
    private appToastrService: AppToastrService, private store: Store<any>, public dragulaService: DragulaService,
    private warehouseproductService: WarehouseproductService) {
      this.dragulaService.createGroup('MOVEWHSHOPPRODUCT', {
      });
      this.dragulaService.dropModel('MOVEWHSHOPPRODUCT').subscribe(args => {
        // console.log(args);
      });
    }

    goToShopProduct(id, name) {
      this.store.dispatch({type: appAction.SELECT_SHOP, payload: {id: id, name: name}});
      Session.saveShop({id: id, name: name});
      this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
    }

  ngOnInit() {
    this.loading = true;
    this.shopProductsDropDownlist = [];
    this.environmentLocal = environment;
    this.moveWarehouseProductList = [];
    this.moveShopProductRecommendationsList = [];
    this.shopProductsRecommendationslist = [];
    this.recommendationId = '';
    this.shopProdctSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.warehouse_id =  s.appMainStore.warehouseId;
          this.shop_id = s.appMainStore.shopId;
          this.shop = {
                        id : s.appMainStore.shopId,
                        name : s.appMainStore.shopName
                      };
    });
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.getAllWarehouseProductInShop();
    // this.getAllWarehouseProductRecommendationList();
  }

  onChangeSelect() {
    this.moveShopProductRecommendationsList = [];
    if ( !!this.selectedProduct && !!this.selectedProduct.prod_id) {
      this.getRecommendationIdForSelectedProduct();
    }
  }

  getRecommendationIdForSelectedProduct() {
    const req = {
      shop_id: this.shop_id,
      sub_id: this.sub_id,
      warehouse_product_id: this.selectedProduct.prod_id
    };
    this.shopproductListService.getRecommendationsForProduct(req)
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.recommendationId = response.msg._id;
          this.moveShopProductRecommendationsList = response.msg.products;
        }
      },
      error => {
        if (!!error && !!error.error_code && error.error_code === 'ERR_RECOMMENDATIONS_GET_112') {
         this.createRecommendationIdForSelectedProduct();
        } else {
          this.appToastrService.showError(error.msg || 'Failed to get Recommendation for the Product.');
        }
      });
  }

  createRecommendationIdForSelectedProduct() {
    const postReqBody = {
      type : 'MANUAL',
      shop_id: this.shop_id,
      sub_id: this.sub_id,
      prod_id: this.selectedProduct.prod_id
  };
    this.shopproductListService.createRecommendationsForProduct(postReqBody)
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.recommendationId = response.id;
        } else {
          this.recommendationId = '';
        }
      },
      error => {
        this.appToastrService.showError(error.msg || 'Failed to get Recommendation for the Product.');
      });
  }
  updateRecommendationIdForSelectedProduct() {
    const putReqBody = {
      shop_id: this.shop_id,
      prod_id: this.selectedProduct.prod_id,
      products: this.moveShopProductRecommendationsList
    };
    if (!!this.recommendationId) {
      this.shopproductListService.updateRecommendationsForProduct(putReqBody, this.recommendationId)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.appToastrService.showSuccess(response.msg || 'Recommendation updated successfully');
          }
        },
        error => {
          this.appToastrService.showError(error.msg || 'Failed to get Recommendation for the Product.');
        });
    }
  }

  showConfirmWindow() {
    this.updateRecommendationIdForSelectedProduct();
  }
  getAllWarehouseProductInShop() {
    const defaultParams = {
      page: 1,
      limit: 1000,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ['name']
    };
    this.shopproductListService.getShopProductsWithPageData(defaultParams, this.sub_id, this.shop_id )
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.moveWarehouseProductList = response.res.docs;
          this.shopProductsDropDownlist = response.res.docs;
          this.loading = false;
          // if ( response.msg.length === 0 ) {
          //   this.onPageLoading = true;
          // }
        } else {
           this.appToastrService.showError(response.msg);
        }
       },
      error => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Failed to get warehosue product.');
      });
  }

  ngOnDestroy() {
    this.dragulaService.destroy('MOVEWHSHOPPRODUCT');
  }
}
