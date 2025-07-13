import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';
import { AppToastrService } from '../../../shared/services/app-toastr.service';
import { CentralwarehouseproductService } from '../centralwarehouseproduct.service';
import { Store } from '@ngrx/store';
import * as appAction from '../../../action/app-actions';
import * as appContant from '../../../shared/structures/app-constant';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-centralwarehouseproduct-list',
  templateUrl: './centralwarehouseproduct-list.component.html',
  styleUrls: ['./centralwarehouseproduct-list.component.scss']
})
export class CentralwarehouseproductListComponent implements OnInit {
  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'gtin', 'category_type']
  };
  warehouseProdSubscription: any;
  warehouseProducts: any[];
  environmentLocal: any;
  gridstate: any;
  totalRecords: number;
  totalPages: number;
  actions: any;
  deleteRowId: '';
  searchFilter: string;
  searchString = '';
  classList: any;
  defaultList: any;
  displayColumnList: any;
  constructor(private appService: AppService, private store: Store<any>,
  private appToastrService: AppToastrService, private centralwarehouseproductService: CentralwarehouseproductService) { }

  ngOnInit() {
    this.environmentLocal = environment;
    this.warehouseProducts = [];
    this.classList = ['prodImg'];
    this.defaultList = [{ isIcon: true, iconValue: 'photo' }];
    this.displayColumnList = {
      picture: 'picture',
      label: 'label',
      logo: 'logo',
      name: 'name'
    };
    this.actions = { edit: true, delete: false };
    this.gridstate = this.defaultParams;
    this.reloadGrid(this.defaultParams);
  }

  reloadGridSearch(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.centralwarehouseproductService.getwarehouseProductsWithPageData(curparams, appContant.CENTRAL_REPOSITORY_ID)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appContant.SUCCESS) {
          const resDocs = response.res.docs;
          this.warehouseProducts = resDocs;
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
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Central Warehouse Product detail failed to get.');
      });
  }

  reloadGrid(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.centralwarehouseproductService.getwarehouseProductsWithPageData(curparams, appContant.CENTRAL_REPOSITORY_ID)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appContant.SUCCESS) {
          const resDocs = response.res.docs;
          this.warehouseProducts = this.warehouseProducts.concat(resDocs);
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
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Central Warehouse Product detail failed to get.');
      });
  }

  onSearchText() {
    this.gridstate.searchvalue = this.searchString;
    this.gridstate.page = 1;
    this.gridstate.pages = 1;
    this.reloadGridSearch(this.gridstate );
  }

  onReloadEvent(event) {
    if (event.action === 'nextPage' && this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('reference/product/update/' + event.item.id);
    }
  }

  editWarehouseProduct(prodId) {
    this.appService.gotoURL('reference/centralwarehouse/centralwarehouseproduct/update/' + prodId);
  }

  createnew() {
    this.appService.gotoURL('reference/centralwarehouse/centralwarehouseproduct/new');
  }

  gotoWarehouse() {
    this.appService.gotoURL('reference/centralwarehouse');
  }

}
