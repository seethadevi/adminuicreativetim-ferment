import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AppService } from 'src/app/shared/services/app.service';
import { ShopproductListService } from '../shopproduct-list.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { WarehouseproductService } from 'src/app/warehouse/warehouseproduct/warehouseproduct.service';

@Component({
  selector: 'app-shopproduct-revert-warehouse',
  templateUrl: './shopproduct-revert-warehouse.component.html',
  styleUrls: ['./shopproduct-revert-warehouse.component.scss']
})
export class ShopproductRevertWarehouseComponent implements OnInit {

  shopProdctSubscription: any;
  sub_id = '';
  warehouse_id = '';
  shop_id = '';
  shop_name = '';
  loadingCheck = false;
  total_sum_wh_count = 0;
  shopProductslist: any[];
  all: any;
  multiple: any;
  loading: boolean;
  @ViewChild('moveSwalSubscription', {static: true}) private moveSwalSubscription: SwalComponent;

  constructor(private appService: AppService, private shopproductListService: ShopproductListService,
    private appToastrService: AppToastrService, private store: Store<any>, private warehouseproductService: WarehouseproductService) { }

  ngOnInit() {
    this.all = 'active';
    this.multiple = '';
    this.loading = true;
    this.shopProdctSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.warehouse_id =  s.appMainStore.warehouseId;
          this.shop_id = s.appMainStore.shopId;
          this.shop_name = s.appMainStore.shopName;
    });
    this.shopProductslist = [];
    // this.getAllShopProductList();
  }

  openConfirmation() {
    this.moveSwalSubscription.fire();
  }


  moveAllProducts() {
  //  console.log('click');
   this.loadingCheck = true;
   this.shopproductListService.moveallProductToWarehouse({'sub_id': this.sub_id, 'shop_id': this.shop_id})
      .subscribe(
      (response: any) => {
        this.loadingCheck = false;
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
        } else {
          this.appToastrService.showError(response.msg);
        }
        this.gotoShopList();
      },
      error => {
        this.loadingCheck = false;
        this.gotoShopList();
        this.appToastrService.showError(error.msg || 'Failed to get Shop Product count.');
      });
  }

  onCloseDialog(event) {
    this.loadingCheck = false;
    // console.log("Swal Dialog Closed");
  }

  gotoShopList() {
    this.appService.gotoURL('subscriptionhome/shop');
  }
}
