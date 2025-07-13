import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from '../channel.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/shared/services/app.service';
import * as appConst from 'src/app/shared/structures/app-constant';
@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit, OnDestroy {

  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: []
  };
  sub_id = '';
  subscriptions: any;
  currSelectedSubscription: String;
  channelSubscription: any;
  channels: any;
  totalChannel = -1;
  MAX_CHANNAL_ALLOWED_LIMIT = appConst.MAX_CHANNAL_ALLOWED_LIMIT;
  moreInfoTab = false;
  selected_channel_id = '';
  refresh_customer: any;
  constructor(private channelService: ChannelService, private appToastrService: AppToastrService,
  private store: Store<any>, private appService: AppService) { }

  ngOnInit() {
    this.channelSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.sub_id = s.appMainStore.subscriptionId;
    });
    this.getChannelList();
  }

  ngOnDestroy() {
    if (!!this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }

  getChannelList() {
    this.channelService.getChannelsWithPageData(this.defaultParams, this.sub_id)
      .subscribe(
        (response: any) => {
        if (response.status === 'success') {
          this.channels = response.res.docs;
          this.totalChannel = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Channel detail failed to get.');
      });
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/channel/new');
  }
  editChannelData(channelId, event) {
    this.appService.gotoURL('/subscriptionhome/channel/update/' + channelId);
    event.preventDefault();
    event.stopPropagation();
  }

  deleteSubscription(channelId) {
    this.channelService.deleteChannel({id: channelId})
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.getChannelList();
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        console.log(error);
        this.appToastrService.showError( error.msg || 'Failed to delete Channel details.');
      });
  }

  showMoreInfo(data) {
    this.moreInfoTab = true;
    this.selected_channel_id = data['id'];
  }

  receiveMessage(event) {
    // console.log('here');
    if (event.action === 'refresh') {
      this.refresh_customer = event;
    }
  }

}
