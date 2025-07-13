import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { AppToastrService } from '../shared/services/app-toastr.service';
import { WarehouseService } from './warehouse.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit, OnDestroy {

  defaultParams = {
    page: 1,
    limit: 5,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: []
  };
  warehouse: any;
  warehouseName =  '';
  warehouseSubscription: any;
  sub_id = '';
  constructor(private appService: AppService, private store: Store<any>,
    private appToastrService: AppToastrService, private warehouseService: WarehouseService) { }

    ngOnInit() {
      this.warehouseSubscription = this.store.select<any>((state: any) => state)
          .subscribe((s: any) => {
            this.sub_id = s.appMainStore.subscriptionId;
      });
      this.reloadGrid();
    }

    ngOnDestroy() {
      if (!!this.warehouseSubscription) {
        this.warehouseSubscription.unsubscribe();
      }
    }

    reloadGrid() {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.warehouseService.getWarehousesWithPageData(this.defaultParams, this.sub_id)
        .subscribe(
        (response: any) => {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === appConst.SUCCESS) {
            this.warehouse = response.res.docs[0];
            this.warehouseName = response.res.docs[0]['name'];
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

    updateWarehouse() {
      this.appService.gotoURL('subscriptionhome/warehouse/update/' + this.warehouse.id);
    }

    gotoWarehouseProduct() {
      this.appService.gotoURL('subscriptionhome/warehouse/warehouseproductlist/');
    }

}
