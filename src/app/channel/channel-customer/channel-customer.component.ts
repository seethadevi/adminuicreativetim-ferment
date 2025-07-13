import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ChannelService } from '../channel.service';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-channel-customer',
  templateUrl: './channel-customer.component.html',
  styleUrls: ['./channel-customer.component.scss']
})
export class ChannelCustomerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() channelId: any;
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['firstname', 'lastname', 'tags']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  customers: any[];
  deleteRowId: '';
  customersSubscription: any;
  sub_id: string;
  @Input() refreshCustComp: any;
  constructor(private store: Store<any>, private channelService: ChannelService, private appService: AppService,
    private appToastrService: AppToastrService) {
      this.customersSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
    });
    }

  ngOnInit() {
    // this.customersSubscription = this.store.select<any>((state: any) => state)
    //     .subscribe((s: any) => {
    //       this.sub_id = s.appMainStore.subscriptionId;
    // });
    this.headers = [
      { key: 'picture_url', cansort: false, lable: 'Picture', image: true},
      { key: 'firstname', cansort: true, label: 'Name', appendColumn: 'lastname'},
      { key: 'tags', cansort: true, label: 'Tags' },
      // { key: 'row_added_dttm', cansort: true, label: 'Requested On', type: 'datetime' }
    ];
    this.actions = { edit: false, delete: false };
    // this.reloadGrid(this.defaultParams);
  }

  ngOnDestroy() {
    if (!!this.customersSubscription) {
      this.customersSubscription.unsubscribe();
    }
  }

  ngOnChanges() {
    // console.log('i am from ngOnChanges cus', this.channelId, 'sub', this.sub_id);
    if (!!this.sub_id && !!this.channelId) {
      this.reloadGrid(this.defaultParams);
    }
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  onOperation(event) {
  }
  reloadGrid(curparams) {
    this.gridstate = curparams;

    this.channelService.getCustomerPageData(curparams, this.sub_id, this.channelId)
      .subscribe(
        (response: any) => {
          // if (response.status === 'success') {
            this.customers = response.res.docs;
            this.totalRecords = response.res.total;
          // } else {
            // this.appToastrService.showError(response.msg);
          // }
        },
        error => {
          // console.log(error);
          if (typeof (error.msg) === 'object') {
          } else {
            this.appToastrService.showError( error.msg || 'Customers detail failed to get.');
          }
        });
  }

}
