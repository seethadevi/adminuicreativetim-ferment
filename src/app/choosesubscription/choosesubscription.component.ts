import { Component, OnInit, AfterViewInit,  } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { AppToastrService } from '../shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import * as appAction from '../action/app-actions';
import { Session } from './../shared/structures/session';
import { AppService } from '../shared/services/app.service';
import * as Chartist from 'chartist';
declare const $: any;
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-choosesubscription',
  templateUrl: './choosesubscription.component.html',
  styleUrls: ['./choosesubscription.component.scss']
})
export class ChoosesubscriptionComponent implements OnInit, AfterViewInit {

  defaultParams = {
    page: 1,
    limit: 10,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: [],
    pages: 0
  };
  subscriptions: any;
  currSelectedSubscription: String;
  deviceOS = null;
  constructor(private subscriptionService: SubscriptionService, private appToastrService: AppToastrService,
    private store: Store<any>, private appService: AppService, private deviceService: DeviceDetectorService) {
    const deviceInfo = this.deviceService.getDeviceInfo();
    this.deviceOS = deviceInfo.os.toLowerCase();
    // console.log(this.deviceOS);
    }

  ngOnInit() {
    this.subscriptions = [];
    this.getSubscriptionList(this.defaultParams);
  }

  getSubscriptionList(loadParam) {
    const currentList = this.subscriptions;
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.subscriptionService.getSubscriptionsWithPageData(loadParam)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === 'success') {
            if (response.res.page === 1) {
              this.subscriptions = response.res.docs;
            } else {
              this.subscriptions = [...currentList, ...response.res.docs];
            }
          this.defaultParams['pages'] = response.res.pages;
          this.defaultParams['total'] = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Subscription detail failed to get.');
      });
  }

  selectSubscription(id) {
    const name = this.subscriptions.find( (item) => {
      return item.id === id;
    });
    Session.saveSubscription({id: id, name: name.name, picture: name.picture, plan: name.plan});
    this.store.dispatch({type: appAction.SELECT_SUBSCRIPTION, payload: {id: id, name: name.name, picture: name.picture, plan: name.plan}});
    this.appService.gotoURL('/subscriptionhome');
  }

  createnew() {
    this.appService.gotoURL('/subscription/new');
  }
  editSubscription(subId) {
   this.appService.gotoURL('subscription/update/' + subId);
  }

  nextPage() {
    console.log('I am scolled');
    if (this.defaultParams.page < this.defaultParams.pages) {
      this.defaultParams.page = this.defaultParams.page + 1;
      this.getSubscriptionList(this.defaultParams);
    }
  }
  onUp() {
    // console.log('i am scolled up');
  }

  deleteSubscription(subId) {
    this.subscriptionService.deleteSubscription({id: subId})
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.getSubscriptionList(this.defaultParams);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        console.log(error);
        this.appToastrService.showError( error.msg || 'Failed to delete subscription details.');
      });
  }

  ngAfterViewInit() {
    const breakCards = true;
    if (breakCards === true) {
        // We break the cards headers if there is too much stress on them :-)
        $('[data-header-animation="true"]').each(function() {
            const $fix_button = $(this);
            const $card = $(this).parent('.card');
            $card.find('.fix-broken-card').click(function() {
                const $header = $(this).parent().parent().siblings('.card-header, .card-image');
                $header.removeClass('hinge').addClass('fadeInDown');

                $card.attr('data-count', 0);

                setTimeout(function() {
                    $header.removeClass('fadeInDown animate');
                }, 480);
            });

            $card.mouseenter(function() {
                const $this = $(this);
                const hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
                $this.attr('data-count', hover_count);
                if (hover_count >= 20) {
                    $(this).children('.card-header, .card-image').addClass('hinge animated');
                }
            });
        });
    }
}
}
