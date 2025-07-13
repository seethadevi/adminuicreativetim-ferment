import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { VendorsubService } from '../vendorsub.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import * as appAction from '../../action/app-actions';

@Component({
  selector: 'app-vendorsub-list',
  templateUrl: './vendorsub-list.component.html',
  styleUrls: ['./vendorsub-list.component.scss']
})
export class VendorsubListComponent implements OnInit, OnDestroy {

  vendorSubscription: any;
  sub_id = '';
  vendors: any;
  currSelectedSubscription: String;
  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'email'],
  };
  gridstate: any;
  totalRecords: number;
  totalPages: number;
  searchString = '';
  classList: any;
  defaultList: any;
  actions: any;
  displayColumnList: any;
  constructor(private appService: AppService, private vendorService: VendorsubService,
    private appToastrService: AppToastrService, private store: Store<any>) { }

  ngOnInit() {
    this.classList = ['prodImg', '' , 'vendorCard'];
    this.defaultList = [{ isIcon: true, iconValue: 'assignment_ind' }];
    this.actions = { edit: false, delete: false };
    this.gridstate = this.defaultParams;
    this.displayColumnList = {
      picture: 'picture',
      label: '',
      logo: '',
      name: 'name'
    };
    this.vendorSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
    });
    this.vendors = [];
    this.reloadGrid(this.defaultParams);
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
      this.appService.gotoURL('reference/vendor/update/' + event.item.id);
    }
  }

  // reloadGrid() {
  //   this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
  //   this.vendorService.getSubscriptionVender({ sub_id : this.sub_id})
  //   .subscribe(
  //   (response: any) => {
  //     this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
  //     if (response.status === 'success') {
  //       this.vendors = response.msg;
  //     } else {
  //       this.appToastrService.showError(response.msg);
  //     }
  //   },
  //   error => {
  //     // console.log(error);
  //     this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
  //     this.appToastrService.showError( error.msg || 'Vendor detail failed to get.');
  //   });
  // }

  reloadGridSearch(curparams) {
    // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.vendorService.getVendorsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.vendors = resDocs;
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
    this.vendorService.getVendorsWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          const resDocs = response.res.docs;
          this.vendors = this.vendors.concat(resDocs);
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
  ngOnDestroy() {
    if (!!this.vendorSubscription) {
      this.vendorSubscription.unsubscribe();
    }
  }

  editVendorDetails(vendorId) {
    this.appService.gotoURL('subscriptionhome/vendorsub/update/' + vendorId);
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/vendorsub/new');
  }

}
