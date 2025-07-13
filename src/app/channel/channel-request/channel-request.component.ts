import { Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ChannelService } from '../channel.service';
import { AppService } from 'src/app/shared/services/app.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-channel-request',
  templateUrl: './channel-request.component.html',
  styleUrls: ['./channel-request.component.scss']
})
export class ChannelRequestComponent implements OnInit, OnDestroy, OnChanges {
  @Input() channelId: any;
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['cust_firstname', 'cust_lastname', 'cust_email', 'channel_name']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  requestList: any[];
  deleteRowId: '';
  reqsSubscription: any;
  sub_id: string;
  selectedRowId = '';
  selectedRowData = {};
  @ViewChild('deleteSwalBox', { static: true }) private deleteSwalBox: SwalComponent;
  @ViewChild('approveSwalBox', { static: true }) private approveSwalBox: SwalComponent;

  @Output()
  messageEventRefresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(private store: Store<any>, private channelService: ChannelService, private appService: AppService,
    private appToastrService: AppToastrService) {
      this.reqsSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
      });
    }

  ngOnInit() {
    // this.reqsSubscription = this.store.select<any>((state: any) => state)
    //     .subscribe((s: any) => {
    //       this.sub_id = s.appMainStore.subscriptionId;
    // });
    this.headers = [
      { key: 'cust_firstname', cansort: true, label: 'Name', appendColumn: 'cust_lastname'},
      { key: 'cust_email', cansort: true, label: 'Email' },
      { key: 'channel_name', cansort: true, label: 'Channel' },
      { key: 'createddate', cansort: true, label: 'Requested On', type: 'datetime' }
    ];
    this.actions = { edit: false, delete: false, reject: true, approve: true };
    // this.reloadGrid(this.defaultParams);
  }

  ngOnDestroy() {
    if (!!this.reqsSubscription) {
      this.reqsSubscription.unsubscribe();
    }
  }

  onOperation(event) {
    this.selectedRowId = event.item.id;
    const data = {
      channel_request_id: event.item._id,
      sub_id: this.sub_id,
      channel_id: event.item.channel_id,
      cust_id: event.item.cust_id,
      channel_name: event.item.channel_name,
      channel_org: event.item.channel_org,
      channel_picture_url: event.item.channel_picture_url,
      accept_status: '',
    };
    this.selectedRowData = Object.assign({}, {} , data);
    if (event.action === 'approve') {
      data['accept_status'] = 'ACCEPTED';
      this.approveSwalBox.fire();
    } else if (event.action === 'reject') {
      data['accept_status'] = 'REJECTED';
      this.deleteSwalBox.fire();
    }
  }

  RejectRecords() {
    this.selectedRowData['accept_status'] = 'REJECTED';
    this.updateStatus(this.selectedRowData);
  }

  ApproveRecords() {
    this.selectedRowData['accept_status'] = 'ACCEPTED';
    this.updateStatus(this.selectedRowData);
  }

  ngOnChanges() {
    // console.log('i am from ngOnChanges req', this.channelId, 'sub', this.sub_id);
    if (!!this.sub_id && !!this.channelId) {
      this.reloadGrid(this.defaultParams);
    }
  }

  onCloseDialog(event) {
  }

  updateStatus(postParam) {
    // console.log(postParam);
    this.channelService.saveCustomerApproveStatus(postParam)
      .subscribe(
      (response: any) => {
         if (response.status === 'success') {
           this.appToastrService.showSuccess(response.msg);
           this.reloadGrid(this.gridstate);
           if (postParam['accept_status'] === 'ACCEPTED') {
            this.messageEventRefresh.emit({ action: 'refresh', id: this.channelId });
           }
         } else {
          if (!!response['errors']) {
            let errorHtml = '<ul>';
            Object.keys(response['errors']).map((item) => {
              errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            });
            errorHtml += '</ul>';
            this.appToastrService.typeCustom(errorHtml);
          } else {
            this.appToastrService.showError(response.msg);
          }
        }
      },
        error => {
        this.appToastrService.showError(error.msg || 'Customer detail failed to save.Please try again later.');
      });
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

    this.channelService.getRequestPageData(curparams, this.sub_id, this.channelId)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.requestList = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
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
