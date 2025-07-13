import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ProductService } from '../ProductService';
import { WinesService } from 'src/app/wines/WinesService';
import * as appAction from './../../../action/app-actions';
import { NavBarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  defaultParams = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'attr.year', 'attr.region.name', 'winery.name']
  };
  gridstate: any;
  totalRecords: number;
  totalPages: number;
  headers: any;
  actions: any;
  products: any[];
  deleteRowId: '';
  isShowTable: boolean;
  searchFilter: string;
  searchString = '';
  classList: any;
  defaultList: any;
  displayColumnList: any;

  @ViewChild('deleteSwalProduct', {static: true}) private deleteSwalProduct: SwalComponent;
  constructor(private productService: ProductService, private appService: AppService,
     private store: Store<any>, private navService: NavBarService,
     private appToastrService: AppToastrService, private wineService: WinesService) { }

  ngOnInit() {
    this.products = [];
    this.classList = ['prodImg', '', 'productCard'];
    this.defaultList = [{ isIcon: true , iconValue : 'photo'}];
    this.headers = [
      { key: 'displayName', cansort: true, label: 'Name' },
      { key: 'attr', cansort: false, label: 'Region', subkey: 'region', subkey1: 'name' },
      { key: 'winery', cansort: false, label: 'Producer', subkey: 'name' },
      { key: 'category_type', cansort: false, label: 'Category', subkey: 'type'},
    ];
    this.displayColumnList = {
      picture: 'picture',
      label: 'label',
      logo: 'logo',
      name: 'displayName'
    };
    this.actions = { edit: true, delete: true };
    this.gridstate = this.defaultParams;
    this.reloadGrid(this.defaultParams);
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

  onReloadEvent(event) {
    if (event.action === 'nextPage' && this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }

  reloadGridSearch(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.wineService.getWinesWithPageData(curparams)
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
        this.appToastrService.showError( error.msg || 'Product detail failed to get.');
      });
  }
  reloadGrid(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.wineService.getWinesWithPageData(curparams)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.products = this.products.concat(resDocs);
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
        this.appToastrService.showError( error.msg || 'Product detail failed to get.');
      });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('reference/product/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalProduct.fire();
    }
  }

  deleteRecords() {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.wineService.deleteWine({id: this.deleteRowId})
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
    this.appService.gotoURL('reference/product/new');
  }
}
