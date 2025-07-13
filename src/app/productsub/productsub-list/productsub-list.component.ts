import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ProductsubService } from '../productsub.service';
import { AppService } from '../../shared/services/app.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import * as appAction from '../../action/app-actions';
import { Store } from '@ngrx/store';
import { NavBarService } from 'src/app/shared/navbar/navbar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productsub-list',
  templateUrl: './productsub-list.component.html',
  styleUrls: ['./productsub-list.component.scss']
})
export class ProductsubListComponent implements OnInit, OnDestroy {
  defaultParams = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['displayName', 'attr.region.name', 'winery.name']
  };
  defaultParams_pending = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['product_displayName', 'product_attr.region.name', 'product_winery.name']
  };
  gridstate: any;
  totalRecords: number;
  totalPages: number;
  gridstateP: any;
  totalRecordsP: number;
  totalPagesP: number;
  actions: any;
  products: any[];
  pendingProducts: any[];
  deleteRowId: '';
  searchFilter: string;
  searchString = '';
  searchStringPending = '';
  classList: any;
  defaultList: any;
  sub_id = '';
  productSubscription: any;
  displayColumnList: any;
  displayColumnList_pending: any;
  activeIdString = '';
  @ViewChild('deleteSwalProduct', {static: true}) private deleteSwalProduct: SwalComponent;
  constructor(private productService: ProductsubService, private appService: AppService,
     private store: Store<any>, private navService: NavBarService, private route: ActivatedRoute,
     private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.products = [];
    this.pendingProducts = [];
    this.productSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.sub_id = s.appMainStore.subscriptionId;
      });
    this.classList = ['prodImg', '', 'productCard'];
    this.defaultList = [{ isIcon: true, iconValue: 'photo' }];
    this.displayColumnList = {
      picture: 'picture',
      label: 'label',
      logo: 'logo',
      name: 'displayName'
    };
    if (this.route.snapshot.params['option']) {
      if (this.route.snapshot.params['option'].toLowerCase() === 'pending') {
        this.activeIdString = 'PendingProduct';
      }
    }
    this.actions = { edit: true, delete: false };
    this.gridstate = this.defaultParams;
    this.gridstateP = this.defaultParams_pending;
    this.reloadGrid(this.defaultParams);
    this.reloadPendingGrid(this.defaultParams_pending);
    // this.navService.currentSearch.subscribe(message => this.searchFilter = message);
  }
  // ngAfterViewInit(){
  //   this.navService.currentSearch.subscribe(message => {
  //     this.searchFilter = message
  //     this.defaultParams.searchvalue = this.searchFilter;
  //     this.products=[];
  //     this.reloadGrid(this.defaultParams,this.products);
  //   });
  //   this.navService.currentTableShow.subscribe(isTableShow => {
  //     this.isShowTable = isTableShow;
  //   });
  // }
  onSearchText() {
    this.gridstate.searchvalue = this.searchString;
    this.gridstate.page = 1;
    this.gridstate.pages = 1;
    this.reloadGridSearch(this.gridstate );
  }

  onSearchTextPending() {
    this.gridstateP.searchvalue = this.searchStringPending;
    this.gridstateP.page = 1;
    this.gridstateP.pages = 1;
    this.reloadPendingGridSearch(this.gridstateP );
  }

  onReloadEvent(event) {
    if (event.action === 'nextPage' && this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }

  onReloadEventPending(event) {
    if (event.action === 'nextPage' && this.gridstateP.page < this.gridstateP.pages) {
      this.gridstateP.page = this.gridstateP.page + 1;
      this.reloadPendingGrid(this.gridstateP);
    }
  }

  ngOnDestroy() {
    if (!!this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  reloadGridSearch(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.productService.getProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.products = resDocs;
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
        if (!!error.msg) {
          this.appToastrService.showError( error.msg.message || 'Product detail failed to get.');
        } else {
          this.appToastrService.showError( 'Product detail failed to get.');
        }
      });
  }

  reloadPendingGridSearch(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.productService.getPendingProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.pendingProducts = resDocs;
          this.totalRecordsP = response.res.total;
          this.totalPagesP = response.res.pages;
          this.gridstateP['pages'] = response.res.pages;
          this.gridstateP['total'] = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (!!error.msg) {
          this.appToastrService.showError( error.msg.message || 'Product detail failed to get.');
        } else {
          this.appToastrService.showError( 'Product detail failed to get.');
        }
      });
  }

  reloadGrid(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.productService.getProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.products = this.pendingProducts.concat(resDocs);
          this.totalRecords = response.res.total;
          this.totalPages = response.res.pages;
          this.gridstate['pages'] = response.res.pages;
          this.gridstate['total'] = response.res.total;
        } else {
          if (!!response.msg && typeof(response.msg) === 'object') {
            this.appToastrService.showError(response.msg.message || 'Product detail failed to get.');
          } else {
            this.appToastrService.showError(response.msg);
          }
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: false } });
        if (!!error.msg) {
          this.appToastrService.showError( error.msg.message || 'Product detail failed to get.');
        } else {
          this.appToastrService.showError( 'Product detail failed to get.');
        }
      });
  }

  reloadPendingGrid(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.productService.getPendingProductsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.pendingProducts = this.pendingProducts.concat(resDocs);
          this.totalRecordsP = response.res.total;
          this.totalPagesP = response.res.pages;
          this.gridstateP['pages'] = response.res.pages;
          this.gridstateP['total'] = response.res.total;
        } else {
          if (!!response.msg && typeof(response.msg) === 'object') {
            this.appToastrService.showError(response.msg.message || 'Product detail failed to get.');
          } else {
            this.appToastrService.showError(response.msg);
          }
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: false } });
        if (!!error.msg) {
          this.appToastrService.showError( error.msg.message || 'Product detail failed to get.');
        } else {
          this.appToastrService.showError( 'Product detail failed to get.');
        }
      });
  }

  onOperation(event) {
    console.log(event);
    if (event.action === 'edit') {
      this.appService.gotoURL('subscriptionhome/productsub/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalProduct.fire();
    }
  }

  onOperationPending(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('subscriptionhome/productsub/pendingupdate/' + event.item.id);
    }
  }

  deleteRecords() {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.productService.deleteProduct({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          const indexPosition = this.products.findIndex((item) =>
            item.id === this.deleteRowId
          );
          this.products.splice(indexPosition, 1);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Failed to delete product details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/productsub/product/new');
  }

}
