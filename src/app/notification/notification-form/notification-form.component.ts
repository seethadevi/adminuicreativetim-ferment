import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { LocationService } from 'src/app/reference-data/location/location.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Urls } from 'src/app/shared/structures/urls';
import { NotificationService } from '../notification.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubscriptionService } from 'src/app/choosesubscription/subscription.service';
import { ShopService } from 'src/app/shop/shop.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { ChannelService } from 'src/app/channel/channel.service';
import { EmailTemplatesubService } from 'src/app/email-templatesub/email-templatesub.service';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit, OnDestroy {

  endDate: any;
  startDate: any;
  notificationModel: any;
  isEdit = false;
  title = 'Add';
  notificationId: '';
  imgUploadUrl = '';
  thumbnailurlBanner = '';
  countryList: any[];
  notificationSubscription: any;
  event_is_invitation = false;
  codeList: any;
  eventList = [];
  sel_event = '';
  emailTemplateList = [];
  sel_template = '';
  mediumList = [{id: '', name: 'Select Medium'},
                    { id: 'MOBILE', name: 'Mobile' },
                  { id: 'SMS', name: 'SMS' },
    { id: 'EMAIL', name: 'Email' }];

  contentTypeList = [{id: '', name: 'Select content Type'},
  { id: 'EVENT', name: 'Event' },
{ id: 'MSG', name: 'MSG' },
    { id: 'BLOG', name: 'Blog' }];

  channelList = [];
  totalChannel = -1;
  MAX_CHANNAL_ALLOWED_LIMIT = appConst.MAX_CHANNAL_ALLOWED_LIMIT;
  isReadOnly = false;
  customer_tag_list = [
    { id: 'RED', btnStyle: 'bt-red', isAdded: false  },
    { id: 'BLUE', btnStyle: 'bt-blue', isAdded: false  },
    { id: 'GREEN', btnStyle: 'bt-green', isAdded: false  },
    { id: 'YELLOW', btnStyle: 'bt-yellow', isAdded: false  },
    { id: 'VIOLET', btnStyle: 'bt-purple', isAdded: false  },
    { id: 'ORANGE', btnStyle: 'bt-orange', isAdded: false },
  ];
  isPublishClick = false;
  subPlan: string;
  CHNANEL_ACCESS_PLANS = appConst.CHNANEL_ACCESS_PLANS;
  // listOfTabString = ['EVENT','EVENT', 'WEBLINK', 'DEFAULT'];
  constructor(private route: ActivatedRoute, public appservice: AppService, private store: Store<any>,
    private locationService: LocationService, private appToastrService: AppToastrService, private urls: Urls,
    private notificationService: NotificationService, private subscriptionService: SubscriptionService,
  private shopService: ShopService, private channelService: ChannelService, private emailTemplatesubService: EmailTemplatesubService) {
      this.imgUploadUrl = this.urls.api['notificationImage'];
  }

  ngOnInit() {
    this.codeList = [];
    this.countryList = [];
    this.notificationModel = {
      channels: [],
      notify_name: '',
      notify_medium: '',
      notify_start_date: '',
      notify_end_date: '',
      notify_location_code: '',
      notify_country_code: '',
      action_type: '',
      cust_filter: {
        tags: []
      },
      content: '',
      content_title: '',
      content_picture: {},
      content_blog_url: '',
      content_evtshop: {},
      content_campaign: {},
      content_type: '',
      notify_status: '',
      sub_id: '',
      content_emailtemplate: {}
    };
    this.notificationSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.countryList = s.appMainStore.list_of_country;
          this.notificationModel.sub_id = s.appMainStore.subscriptionId;
          this.subPlan = s.appMainStore.subPlan;
        });
    if (this.CHNANEL_ACCESS_PLANS.indexOf(this.subPlan) !== -1) {
      this.getListOfChannels();
    } else {
      this.getSubEventList();
    }
    this.getListOfEmailTemplate();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.notificationId = this.route.snapshot.params['id'];
    } else {

    }
  }

  ngOnDestroy() {
    if (!!this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  addCustomerTag(tag , idx) {
    if (!this.isReadOnly) {
      this.customer_tag_list[idx]['isAdded'] = !this.customer_tag_list[idx]['isAdded'];
    }
    return false;
  }

  addChannel(channel, idx) {
    if (!this.isReadOnly) {
      this.channelList[idx]['isAdded'] = !this.channelList[idx]['isAdded'];
    }
    return false;
  }

  getSubEventList() {
    const curparams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ['name']
    };
    this.shopService.getShopsWithPageData(curparams, this.notificationModel.sub_id)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.notificationModel.content_evtshop = {};
          this.eventList = response.res.docs;
          if (this.isEdit) {
            this.getNotificationDetail();
          }
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        this.appToastrService.showError(error.msg || 'Shop detail failed to get.');
      });
  }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
    if (this.notificationModel.notify_country_code) {
      return this.locationService
       .getLocationsWithPageData(text$, this.notificationModel.notify_country_code, true)
       .pipe(
         map(
           data => data
         )
       );
    }
  }

  onAddingCode(item: string) {
    this.notificationModel['notify_location_code'] = item['code'];
  }

  onRemovingCode(item: string) {
    this.notificationModel['notify_location_code'] = '';
  }

  onClearValue() {
    this.appservice.gotoURL('/subscriptionhome/notification');
  }

  gotoCreateChannel() {
    this.appservice.gotoURL('/subscriptionhome/channel');
  }
  getListOfChannels() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: []
    };
    this.channelService.getChannelsWithPageData(defaultParams, this.notificationModel.sub_id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
          const channels = response.res.docs;
            this.channelList = channels.map((channel) => {
              const item = channel;
              item['isAdded'] = false;
              return item;
          });
            this.totalChannel = response.res.total;
            this.getSubEventList();
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Channel detail failed to get.');
      });
  }


  getListOfEmailTemplate() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: []
    };
    this.emailTemplatesubService.getHtmlTemplatesWithPageData(defaultParams, this.notificationModel.sub_id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.emailTemplateList = response.res.docs;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Channel detail failed to get.');
      });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  getNotificationDetail() {
    this.notificationService.getNotification({id: this.notificationId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
          this.notificationModel = response.msg;
          this.startDate = response.msg.notify_start_date;
          this.endDate = response.msg.notify_end_date;
          this.thumbnailurlBanner = !!response.msg.content_picture ? response.msg.content_picture['sm'] : '';
          if (!!response.msg.notify_location_code) {
            this.codeList.push(response.msg.notify_location_code);
          }
          this.sel_event = response.msg.content_evtshop;
          this.sel_template = response.msg.content_emailtemplate;
          if (this.notificationModel.notify_status === 'PUBLISHED' || this.notificationModel.notify_status === 'IN_PROGRESS') {
            this.isReadOnly = true;
          }
          this.channelList = this.channelList.map((channel) => {
            const channelObj = this.notificationModel.channels.find(s => s._id === channel.id);

            if ( !!channelObj ) {
              channel['isAdded'] = true;
            }
            return channel;
          });
          this.customer_tag_list = this.customer_tag_list.map((tag) => {
            if (this.notificationModel.cust_filter.tags.indexOf(tag['id']) !== -1) {
              tag['isAdded'] = true;
            }
            return tag;
          });
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Notification detail failed to get.Please try agian later.');
    });
  }

  onFileUploadEventBanner(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.notificationModel.content_picture = '';
    } else {
      this.notificationModel.content_picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  displayEventDetail() {
    // console.log(this.sel_event);
    this.notificationModel.content_evtshop = {
      id: this.sel_event['id'],
      name: this.sel_event['name'],
      logo: this.sel_event['logo'],
      picture: this.sel_event['picture'],
      endDate: this.sel_event['endDate'],
      startDate: this.sel_event['startDate'],
      country_code: this.sel_event['country_code'],
      location_code: this.sel_event['location_code'],
      address: this.sel_event['address']
    };
  }

  seTemplateDetail() {
    this.notificationModel.content_emailtemplate = {
      id: this.sel_template['id'],
      name: this.sel_template['name']
    };
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  publishClick() {
    this.isPublishClick = true;
  }

  onSubmit(f: NgForm) {
    this.notificationModel.notify_end_date = this.endDate;
    this.notificationModel.notify_start_date = this.startDate;

    if (!!this.event_is_invitation) {
      this.notificationModel.content_type = ['EVENT_INVITATION'];
    }

    // Update the notofication name with content title
    this.notificationModel.notify_name = this.notificationModel.content_title;

    this.notificationModel.cust_filter['tags'] = [];
    this.customer_tag_list.forEach((item) => {
      if (item.isAdded) {
        this.notificationModel.cust_filter.tags.push(item.id);
      }
    });

    this.notificationModel.channels = [];
    this.channelList.forEach((item) => {
      if (item.isAdded) {
        this.notificationModel.channels.push(item);
      }
    });
    console.log(this.notificationModel);

    if (!!this.notificationModel.notify_name && !!this.notificationModel.notify_country_code &&
    !!this.notificationModel.notify_start_date && !!this.notificationModel.notify_end_date
     && !!this.notificationModel.content_type && !!this.notificationModel.notify_medium) {
      if (this.notificationModel.content_type === 'BLOG') {
        this.notificationModel.content_evtshop = {};
        this.notificationModel.content = '';
      } else if (this.notificationModel.content_type === 'EVENT' || this.notificationModel.content_type === 'EVENT_INVITATION') {
        this.notificationModel.content_blog_url = '';
        this.notificationModel.content = '';
      } else if (this.notificationModel.content_type === 'MSG') {
        this.notificationModel.content_blog_url = '';
        this.notificationModel.content_evtshop = {};
      }
      if (!this.isEdit) {
        this.saveNotification();
      } else {
        const newModel = Object.assign({}, this.notificationModel, { id: this.notificationId });
        this.updateNotification(newModel);
      }
    }
  }

  saveNotification() {
    this.notificationService.saveNotification(this.notificationModel)
      .subscribe(
      (response: any) => {
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === 'success') {
            if (!!this.isPublishClick) {
              this.publishNotification(response.id);
            } else {
              this.appToastrService.showSuccess(response.msg);
              this.onClearValue();
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
        // console.log(error);
        // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Notification detail failed to save.Please try again later.');
      });
  }

  updateNotification(updateNotification) {
    this.notificationService.updateNotification(updateNotification)
    .subscribe(
    (response: any) => {
      // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          if (!!this.isPublishClick) {
            this.publishNotification(this.notificationId);
          } else {
            this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
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
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Notification detail failed to update.Please try agian later.');
    });
  }

  publishNotification(publishNotificationId) {
    this.notificationService.publishNotification( publishNotificationId )
    .subscribe(
    (response: any) => {
      // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
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
      this.appToastrService.showError(error.msg || 'Notification detail failed to publish.Please try again later.');
    });
  }

}
