import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { WarehouseproductService } from './../warehouseproduct/warehouseproduct.service';
import { Store } from '@ngrx/store';
import * as appAction from '../../action/app-actions';
import { environment } from '../../../environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-warehouseproduct-list',
  templateUrl: './warehouseproduct-list.component.html',
  styleUrls: ['./warehouseproduct-list.component.scss']
})
export class WarehouseproductListComponent implements OnInit, OnDestroy {

  defaultParams = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: []
  };
  totalRecords: number;
  totalPages: number;
  searchString: any = '';
  showErrorMsg: boolean;
  errorMsg: string;
  deviceOS = null;
  searchDropSelect = {name: 'All', attrName: 'all'};
  drops = [
    {name: 'All', attrName: 'all'},
    {name: 'Name', attrName: 'name'},
    {name: 'Region', attrName: 'attr.region.name'},
    {name: 'Producer', attrName: 'producer.name'},
    {name: 'Year', attrName: 'attr.year'}
  ];
  warehouseProdSubscription: any;
  warehouseProducts: any[];
  sub_id = '';
  warehouse_id = '';
  environmentLocal: any;
  queryparams: any;
  gridstate: any;
  constructor(private appService: AppService, private store: Store<any>,
    private appToastrService: AppToastrService, private warehouseproductService: WarehouseproductService,
    private deviceService: DeviceDetectorService) {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceOS = deviceInfo.os.toLowerCase();
    }

  ngOnInit() {
    this.warehouseProducts = [];
    this.showErrorMsg = false;
    this.environmentLocal = environment;
    this.warehouseProdSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
          this.warehouse_id = s.appMainStore.warehouseId;
        });
        this.gridstate = this.defaultParams;
    this.reloadGrid(this.defaultParams);
  }

  nextPage() {
    if (this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }
  // getPhotos() {
  //   console.log(this.page);
  //   this.warehouseproductService.getMyPhotos(this.page).subscribe((res) => this.onSuccess(res));
  // }
  // // When we got data on a success
  // onSuccess(res) {
  //   console.log(res);
  //   // tslint:disable-next-line: triple-equals
  //   if (res != undefined) {
  //     res.forEach(item => {
  //       this.myPhotosList.push(new PhotosObj(item));
  //     });
  //   }
  // }
  // When scroll down the screen
  // onScroll() {
  //   // console.log("Scrolled");
  //   this.page = this.page + 1;
  //   this.getPhotos();
  // }


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
    // elem.innerHTML = val.name;
    // this.searchString = ''; // Clear the search string after the drop down change
    // this.gridstate.page = 1;
    // this.gridstate.pages = 1;
    // this.gridstate.searchvalue = '';
    // this.gridstate.searchelems = [];
    // this.reloadGridSearch(this.gridstate);
  }

  ngOnDestroy() {
    if (!!this.warehouseProdSubscription) {
      this.warehouseProdSubscription.unsubscribe();
    }
  }

  reloadGridSearch(curparams) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.warehouseproductService.getwarehouseProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Warehouse Product detail failed to get.');
      });
  }

  reloadGrid(curparams) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.warehouseproductService.getwarehouseProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Warehouse Product detail failed to get.');
      });
  }
  editWarehouseProduct(prodId) {
    this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/update/' + prodId);
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/new');
  }

  gotoAddStock(id) {
    this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/addstock/' + id);
  }
  gotoARemoveStock(id) {
    this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/removestock/' + id);
  }
  gotoWarehouse() {
    this.appService.gotoURL('subscriptionhome/warehouse');
  }
}
