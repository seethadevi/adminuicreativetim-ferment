import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppService } from './../../../shared/services/app.service';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { CustomersService } from './../customers.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from './../../../action/app-actions';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  customers: any[];
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['firstname', 'lastname', 'mobile', 'email']
  };
  deleteRowId: '';
  @ViewChild('deleteSwalCustomer', {static: true}) private deleteSwalCustomer: SwalComponent;
  constructor(private store: Store<any>, private appService: AppService, private appToastrService: AppToastrService,
    private customerService: CustomersService) {

  }

  ngOnInit() {
    this.headers = [
      { key: 'firstname', cansort: true, label: 'Name', appendColumn:  'lastname'},
      { key: 'email', cansort: true, label: 'Email' }
    ];
    this.actions = { edit: true, delete: false };
    this.reloadGrid(this.defaultParams);
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  reloadGrid(curparams) {
    this.gridstate = curparams;
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.customerService.getCustomersWithPageData(curparams)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.customers = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        },
        error => {
          // console.log(error);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          this.appToastrService.showError(error.msg || 'Customers detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('reference/customer/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalCustomer.fire();
    }
  }
  deleteRecords() {
    this.customerService.deleteCustomer({ id: this.deleteRowId })
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.appToastrService.showSuccess(response.msg);
            this.reloadGrid(this.gridstate);
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          console.log(error);
          this.appToastrService.showError(error.msg || 'Failed to delete customer details.');
        });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }
  createnew() {
    this.appService.gotoURL('reference/customer/new');
  }

}
