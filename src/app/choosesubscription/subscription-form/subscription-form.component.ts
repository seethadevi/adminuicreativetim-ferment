import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../shared/services/app.service';
import { Subscription } from '../../shared/models/subscription.model';
import { SubscriptionService } from '../subscription.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import * as appAction from '../../action/app-actions';
import {Observable, of} from 'rxjs';
 import { Urls } from '../../shared/structures/urls';
import { VendorsubService } from 'src/app/vendorsub/vendorsub.service';
declare const $: any;
@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent implements OnInit, OnDestroy {
  // @ViewChild('f') userForm: NgForm;
  subSubscription: any;
  title: String = '';
  validation: false;
  isEdit: Boolean = false;
  subModel: Subscription = {
    name: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmpassword: '',
    email: '',
    mobile: '',
    status: 'A',
    type: '',
    plan: 'GOLD',
    settings: {},
    billing: {},
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    picture: ''
  };
  subId: string;
  choosen_sub_id = '';
  imgUploadUrl = '';
  thumbnailurl = '';
  countryList: any[];
  userRole = '';

  constructor(private route: ActivatedRoute, private store: Store<any>, public appservice: AppService,
    private subscriptionService: SubscriptionService, private appToastrService: AppToastrService,
    private warehouseService:  WarehouseService, private vendorsubSerivce: VendorsubService, private urls: Urls) {
      this.imgUploadUrl = this.urls.api['subscriptionImage'];
     }

  ngOnInit() {

    this.subSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.countryList = s.appMainStore.list_of_country;
        this.choosen_sub_id = s.appMainStore.subscriptionId;
        this.userRole = s.appMainStore.loggedInUser.role;
    });
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.subId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getSubscriptionIdDetail();
    } else {
      this.title = 'Add';
    }
    this.thumbnailurl = '';


    //
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
        // Code for the Validator



  $('.card-wizard').bootstrapWizard({
    'tabClass': 'nav nav-pills',
    'nextSelector': '.btn-next',
    'previousSelector': '.btn-previous',

    onNext: function(tab, navigation, index) {
        // var $valid = $('.card-wizard form').valid();
        // if(!$valid) {
        //     $validator.focusInvalid();
        //     return false;
        // }
    },

    onInit: function(tab: any, navigation: any, index: any) {

      // check number of tabs and fill the entire row
      let $total = navigation.find('li').length;
      const $wizard = navigation.closest('.card-wizard');

      const $first_li = navigation.find('li:first-child a').html();
      const $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
      $('.card-wizard .wizard-navigation').append($moving_div);

      $total = $wizard.find('.nav li').length;
     let  $li_width = 100 / $total;

      const total_steps = $wizard.find('.nav li').length;
      let move_distance = $wizard.width() / total_steps;
      let index_temp = index;
      let vertical_level = 0;

      const mobile_device = $(document).width() < 600 && $total > 3;

      if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
      }

      $wizard.find('.nav li').css('width', $li_width + '%');

      const step_width = move_distance;
      move_distance = move_distance * index_temp;

      const $current = index + 1;

      if ($current === 1 || (mobile_device === true && (index % 2 === 0) )) {
          move_distance -= 8;
      } else if ($current === total_steps || (mobile_device === true && (index % 2 === 1))) {
          move_distance += 8;
      }

      if (mobile_device) {
        const x: any = index / 2;
        vertical_level = parseInt(x, 10) + 1 || 0;
        vertical_level = vertical_level * 38;
      }

      $wizard.find('.moving-tab').css('width', step_width);
      $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

      });
      $('.moving-tab').css('transition', 'transform 0s');
   },

    onTabClick : function(tab: any, navigation: any, index: any) {

        const $valid = $('.card-wizard form').valid();

        if (!$valid) {
            return false;
        } else {
            return true;
        }
    },

    onTabShow: function(tab: any, navigation: any, index: any) {
        let $total = navigation.find('li').length;
        let $current = index + 1;
        elemMainPanel.scrollTop = 0;
        const $wizard = navigation.closest('.card-wizard');

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
            $($wizard).find('.btn-next').hide();
            $($wizard).find('.btn-finish').show();
        } else {
            $($wizard).find('.btn-next').show();
            $($wizard).find('.btn-finish').hide();
        }

        const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

        setTimeout(function() {
            $('.moving-tab').text(button_text);
        }, 150);

        const checkbox = $('.footer-checkbox');

        if ( index !== 0 ) {
            $(checkbox).css({
                'opacity': '0',
                'visibility': 'hidden',
                'position': 'absolute'
            });
        } else {
            $(checkbox).css({
                'opacity': '1',
                'visibility': 'visible'
            });
        }
        $total = $wizard.find('.nav li').length;
       let  $li_width = 100 / $total;

        const total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        const mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
            move_distance = $wizard.width() / 2;
            index_temp = index % 2;
            $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        const step_width = move_distance;
        move_distance = move_distance * index_temp;

        $current = index + 1;

        if ($current === 1 || (mobile_device === true && (index % 2 === 0) )) {
            move_distance -= 8;
        } else if ($current === total_steps || (mobile_device === true && (index % 2 === 1))) {
            move_distance += 8;
        }

        if (mobile_device) {
          const x: any = index / 2;
          vertical_level = parseInt(x, 10) + 1 || 0;
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
            'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
            'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });
    }
});
  }

  onFileUploadEvent(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.subModel.picture = '';
    } else {
      this.subModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  getSubscriptionIdDetail() {
    this.subscriptionService.getSubscriptions({id: this.subId})
    .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.subModel = response.msg;
        this.thumbnailurl = !!response.msg.picture ? response.msg.picture['lg'] : '';
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Subscription detail failed to get.Please try agian later.');
    });
  }

  ngOnDestroy(): void {
    if (!!this.subSubscription) {
      this.subSubscription.unsubscribe();
    }
  }

  // public requestAutocompleteItemsCountry = (text: string): Observable<any[]> => {
  //   return of([
  //       {
  //         'id' : 'FRANCE',
  //         'name': 'France',
  //         'picture': '/assets/img/defaults/country/france.png'
  //       }, {
  //         'id' : 'GERMANY',
  //         'name': 'Germany',
  //         'picture': '/assets/img/defaults/country/germany.png'
  //       },
  //       //  {
  //       //   'id' : 'United Kingdom',
  //       //   'name': 'United Kingdom',
  //       //   'picture': '/assets/img/defaults/country/united-kingdom.png'
  //       // }
  //   ]);
  // }


  onSubmit(f: NgForm) {
    // TODO - Need to email validation
    if (!this.isEdit && !!this.subModel.name && !!this.subModel.password && !!this.subModel.firstname &&
      !!this.subModel.lastname && !!this.subModel.email && !!this.subModel.type &&
      !!this.subModel.plan && !!this.subModel.address.address1 && !!this.subModel.address.city
      && !!this.subModel.address.zip && !!this.subModel.address.country &&
       (this.subModel.password === this.subModel.confirmpassword)) {
      this.saveSubscription();
    } else if (this.isEdit && !!this.subModel.name && !!this.subModel.firstname && !!this.subModel.plan &&
      !!this.subModel.lastname && !!this.subModel.email && !!this.subModel.type &&
      !!this.subModel.address.address1 && !!this.subModel.address.city
      && !!this.subModel.address.zip && !!this.subModel.address.country) {
      const newModel = Object.assign( {}, this.subModel , { id : this.subId});
      this.updateSubscription(newModel);
    }
  }
  saveSubscription() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.subscriptionService.saveSubscription(this.subModel)
      .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.saveSelfVendorDetail(response.id);
          this.saveWarehouseDetail(response.id);
          this.saveFermyntVendorDetail(response.id);
        } else {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Subscription detail failed to save.Please try again later.');
      });
  }

  saveWarehouseDetail(sub_id) {
    const warehouse = {
      name: 'Default Warehouse',
      sub_id: sub_id,
      address: this.subModel.address,
      status: 'A',
      description: this.subModel.firstname + ' ' + this.subModel.lastname
    };
    this.warehouseService.saveWarehouse(warehouse)
    .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.onClearValue();
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.onClearValue();
    });
  }

  saveSelfVendorDetail(sub_id) {
    const vendor = {
      name: 'Self',
      description: 'Self as Vendor',
      sub_id: sub_id,
      address: this.subModel.address,
      status: 'A',
      email: this.subModel.email,
      mobile: this.subModel.mobile,
      URL: 'http://',
      isCentral: 'FALSE'
    };
    this.vendorsubSerivce.saveVendor(vendor)
    .subscribe(
      (response: any) => {
      },
      error => {
        // console.log(error);
    });
  }

  saveFermyntVendorDetail(sub_id) {
    const vendor = {
      name: 'Fermynt Warehouse',
      description: 'Fermynt as Warehouse',
      sub_id: sub_id,
      address: this.subModel.address,
      status: 'A',
      email: this.subModel.email,
      mobile: this.subModel.mobile,
      URL: 'http://',
      isCentral: 'TRUE'
    };
    this.vendorsubSerivce.saveVendor(vendor)
    .subscribe(
      (response: any) => {
      },
      error => {
        // console.log(error);
    });
  }

  updateSubscription(updateSubscription) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.subscriptionService.updateSubscription(updateSubscription)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Subscription detail failed to update.Please try agian later.');
    });
  }
  onClearValue() {
    // this.subModel = {
    //   name: '',
    //   firstname: '',
    //   lastname: '',
    //   password: '',
    //   confirmpassword: '',
    //   email: '',
    //   mobile: '',
    //   status: 'A',
    //   type: '',
    //   plan: '',
    //   settings: '',
    //   billing: '',
    //   address: {
    //     address1: '',
    //     address2: '',
    //     city: '',
    //     state: '',
    //     zip: ''
    //   }
    // };
    if (this.choosen_sub_id === this.subId || this.userRole === 'SUBSCRIPTION') {
      this.appservice.gotoURL('/subscriptionhome');
    } else {
      this.appservice.gotoURL('/choosesubscription');
    }
  }
}
