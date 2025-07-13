import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Urls } from 'src/app/shared/structures/urls';
import { ChannelService } from '../channel.service';
import { NgForm } from '@angular/forms';
import * as appConst from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-channel-form',
  templateUrl: './channel-form.component.html',
  styleUrls: ['./channel-form.component.scss']
})
export class ChannelFormComponent implements OnInit, OnDestroy {
  isEdit: boolean;
  channelModel: any;
  channelSubscription: any;
  imgUploadUrl = '';
  title = 'Add';
  channelId = '';
  thumbnailurl = '';

  constructor(private route: ActivatedRoute, public appservice: AppService, private store: Store<any>,
    private channelservice: ChannelService, private appToastrService: AppToastrService, private urls: Urls) {
      this.imgUploadUrl = this.urls.api['channelImage'];
     }

  ngOnInit() {
    this.channelModel = {
      name: '',
      description: '',
      org: '',
      picture: '',
      isPrivate: false,
      sub_id: ''
    };
    this.thumbnailurl = '';

    this.channelSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.channelModel.sub_id = s.appMainStore.subscriptionId;
    });

    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.channelId = this.route.snapshot.params['id'];
      this.getChannelIdDetail();
    } else {
      this.isEdit = false;
    }
  }

  getChannelIdDetail() {
    this.channelservice.getChannel({id: this.channelId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
        this.channelModel = response.msg;
        this.thumbnailurl = !!response.msg.picture ? response.msg.picture['md'] : '';
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Channel detail failed to get.Please try agian later.');
    });
  }

  ngOnDestroy() {
    if (!!this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }

  onClearValue() {
    this.appservice.gotoURL('subscriptionhome/channel');
  }

  onFileUploadEvent(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.channelModel.picture = '';
    } else {
      this.channelModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  onSubmit(f: NgForm) {
    if (!!this.channelModel.name && !!this.channelModel.org && !!this.channelModel.picture) {
        if (this.isEdit) {
          const newModel = Object.assign({}, this.channelModel, {'id': this.channelId});
          this.updateChannel(newModel);
        } else {
          this.saveChannel();
        }

      }
    console.log('My saved value', this.channelModel);
  }

  saveChannel() {
    this.channelservice.saveChannel(this.channelModel)
      .subscribe(
      (response: any) => {
         if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
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
          // debugger;
        // console.log(error);
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Channel detail failed to save.Please try again later.');
      });
  }

  updateChannel(updateChannel) {
    this.channelservice.updateChannel(updateChannel)
    .subscribe(
    (response: any) => {
      // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === appConst.SUCCESS) {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
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
      // console.log(error);
      // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Channel detail failed to update.Please try agian later.');
    });
  }

}
