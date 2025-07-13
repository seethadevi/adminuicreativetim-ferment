import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ShopTariffService } from '../shop-tariff.service';

@Component({
  selector: 'app-eventshop-customer',
  templateUrl: './eventshop-customer.component.html',
  styleUrls: ['./eventshop-customer.component.scss']
})
export class EventshopCustomerComponent implements OnInit, OnDestroy {

  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['cust_mobile', 'cust_firstname', 'cust_lastname', 'cust_email']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  eventVisiters: any[];
  deleteRowId: '';
  shopSubscription: any;
  sub_id = '';
  shopId = '';
  constructor(private store: Store<any>, private shopTariffService: ShopTariffService, private appService: AppService,
    private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.shopSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.sub_id = s.appMainStore.subscriptionId;
      this.shopId = s.appMainStore.shopId;
    });
    this.headers = [
      { key: 'cust_firstname', cansort: true, label: 'Name', appendColumn: 'cust_lastname' },
      { key: 'cust_email', cansort: true, label: 'Email'},
      { key: 'row_added_dttm', cansort: false, label: 'Visited On', type: 'datetime' },
    ];
    this.actions = { edit: false, delete: false };
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
    const param = Object.assign({}, curparams, {sub_id: this.sub_id, shop_id: this.shopId});


    this.shopTariffService.getEvenVisitersWithPageData(param)
      .subscribe(
        (response: any) => {
          // if (response.status === 'success') {
            this.eventVisiters = response.res.docs;
            this.totalRecords = response.res.total;
          // } else {
            // this.appToastrService.showError(response.msg);
          // }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Event visiters detail failed to get.');
        });
  }

  onOperation(event) {
  }

  ngOnDestroy() {
    if (!!this.shopSubscription) {
      this.shopSubscription.unsubscribe();
    }
  }

}
