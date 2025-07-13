import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { CentralwarehouseService } from './centralwarehouse.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-centralwarehouse',
  templateUrl: './centralwarehouse.component.html',
  styleUrls: ['./centralwarehouse.component.scss']
})
export class CentralwarehouseComponent implements OnInit {

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
  sub_id = '';
  constructor(private appService: AppService, private store: Store<any>,
  private appToastrService: AppToastrService, private centralwarehouseService: CentralwarehouseService) { }

  ngOnInit() {

    this.reloadGrid();
  }

  reloadGrid() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.centralwarehouseService.getCentralWarehousesWithPageData(this.defaultParams)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          this.warehouse = !!response.res.docs.length ? response.res.docs[0] : '';
          this.warehouseName = !!response.res.docs.length ? response.res.docs[0]['name'] : '';
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
    this.appService.gotoURL('reference/centralwarehouse/update/' + this.warehouse.id);
  }

  gotoWarehouseProduct() {
    this.appService.gotoURL('reference/centralwarehouse/centralwarehouseproductlist');
  }

}
