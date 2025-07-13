import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaxclassService } from '../taxclass.service';
import { AppService } from './../../../shared/services/app.service';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as appAction from './../../../action/app-actions';

@Component({
  selector: 'app-taxclass-list',
  templateUrl: './taxclass-list.component.html',
  styleUrls: ['./taxclass-list.component.scss']
})
export class TaxclassListComponent implements OnInit, OnDestroy {
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'country']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  taxclasses: any[];
  sub_id = '';
  taxclassSubscription: any;

  constructor(private appService: AppService, private router: Router, private store: Store<any>,
    private appToastrService: AppToastrService, private taxclasservice: TaxclassService) { }

  ngOnInit() {
    this.headers = [
      { key: 'country', cansort: true, label: 'Country' , subkey: 'name'},
      { key: 'name', cansort: true, label: 'Name' },
      { key: 'tax_class_percent', cansort: false, label: 'Tax Percentage' },
    ];
    this.actions = { edit: true, delete: false };
    // console.log('My URL is ', this.router.url);

    this.taxclassSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
    });
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.reloadGrid(this.defaultParams);
    // if (this.router.url === '/taxclasssub') {
    //   this.isSusbscriptionPage = true;
    //   this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    //   this.getSubscriptionTaxclass();
    // } else if (this.router.url === '/taxclass') {
    //   this.isSusbscriptionPage = false;
    // } else {
    //   this.isSusbscriptionPage = false;
    //   // Do nothing
    // }
  }

  ngOnDestroy() {
    if (!!this.taxclassSubscription) {
      this.taxclassSubscription.unsubscribe();
    }
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  getSubscriptionTaxclass() {

    this.taxclasservice.getSubscriptionTaxclass({sub_id: this.sub_id})
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.taxclasses = response.msg;
          this.totalRecords = response.msg.length;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Event detail failed to get.');
      });
  }

  reloadGrid(curparams) {
    this.gridstate = curparams;

    this.taxclasservice.getTaxclasssWithPageData(curparams)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.taxclasses = response.res.docs;
          this.totalRecords = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Event detail failed to get.');
      });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('reference/taxclass/update/' + event.item._id);
    }
  }

  createnew() {
    this.appService.gotoURL('reference/taxclass/new');
  }


}
