import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppService } from '../shared/services/app.service';
import { AppToastrService } from '../shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from '../action/app-actions';
import { CustomersService } from '../reference-data/customers/customers.service';

@Component({
  selector: 'app-webcustomer',
  templateUrl: './webcustomer.component.html',
  styleUrls: ['./webcustomer.component.scss']
})
export class WebcustomerComponent implements OnInit {
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  customers: any[];
  currentPage = 1;
  totalPages = 1;
  webcustomerSubscription: any;
  sub_id = '';
  defaultParams = {
    page: this.currentPage,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['firstname', 'lastname', 'mobile', 'email']
  };

  constructor(private store: Store<any>, private appService: AppService, private appToastrService: AppToastrService,
    private customerService: CustomersService) {

  }

  ngOnInit() {
    this.webcustomerSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.sub_id = s.appMainStore.subscriptionId;
    });
    this.headers = [
      { key: 'picture_url', cansort: false, lable: 'Picture', image: true},
      { key: 'firstname', cansort: true, label: 'Name', appendColumn: 'lastname' },
      { key: 'email', cansort: true, label: 'Email' },
      { key: 'row_added_dttm', cansort: false, label: 'Visited On', type: 'datetime' },
    ];
    // this.defaultParams.searchvalue = this.sub_id;
    this.reloadGrid(this.defaultParams);
  }

  loadMoreCustomer() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const defaultParams = {
        page: this.currentPage,
        limit: 25,
        sortkey: '',
        sortorderstring: 'desc',
        searchvalue: '',
        searchelems: ['firstname', 'lastname', 'mobile', 'email']
      };
      this.reloadGrid(defaultParams);
    }
  }

  getMoreDetailOfCustomer(customerId) {
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  onOperation(event) {
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }


  reloadGrid(curparams) {
    this.gridstate = curparams;
    // const oldCustomerList = this.customers;
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.customerService.getCustomersWithPageDataSub(curparams, this.sub_id)
      .subscribe(
        (response: any) => {
          // if (response.status === 'success') {
            // if ( response.res.page === 1 ) {
              this.customers = response.res.docs;
            // } else {
              // this.customers = [...oldCustomerList, ...response.res.docs];
            // }
            this.totalPages = response.res.pages;
            this.totalRecords = parseInt(response.res.total, 10) + 1 || 0;
          // } else {
          //   this.appToastrService.showError(response.msg);
          // }
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        },
        error => {
          // console.log(error);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          this.appToastrService.showError(error.msg || 'Customers detail failed to get.');
        });
  }
}
