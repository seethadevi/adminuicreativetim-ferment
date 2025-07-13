import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionService } from 'src/app/choosesubscription/subscription.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import swal from 'sweetalert2';
import { SettingsService } from '../settings.service';
import { AppService } from 'src/app/shared/services/app.service';
declare var $: any;

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.scss']
})
export class SettingsFormComponent implements OnInit, OnDestroy {
  weezeventSubscription: any;
  listOfTabString = ['weezevent'];
  title = 'Weezevent Token';
  selectedTab: String;
  accessToken = '';
  susbscriptionId: '';
  susbscriptionName: '';
  subscriptionModel: any;
  encoded_accessToken = '';
  btnText = 'Generate';

  constructor( private store: Store<any>, private subscriptionService: SubscriptionService, private appService: AppService,
    private appToastrService: AppToastrService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.selectedTab = this.listOfTabString[0];
    this.weezeventSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
        this.susbscriptionId = s.appMainStore.subscriptionId;
        this.susbscriptionName = s.appMainStore.currentlySelectedSubscription;
    });
    this.getSubscriptionDetails();
  }
  ngOnDestroy() {
    if (!!this.weezeventSubscription) {
      this.weezeventSubscription.unsubscribe();
    }
  }

  getSubscriptionDetails() {
    this.settingsService.getWeezeventSettings( this.susbscriptionId )
    .subscribe(
      (response: any) => {
        this.subscriptionModel = response.msg;
        const subscriptionData = response.msg;
        if ((typeof (subscriptionData.settings) === 'object' &&
          Object.keys(subscriptionData.settings).length === 0)) {
          this.accessToken = '';
        } else if ((typeof (subscriptionData.settings) === 'object' &&
          (Object.keys(subscriptionData.settings).length !== 0 ||
            ( !!subscriptionData.settings.weezevent && Object.keys(subscriptionData.settings.weezevent).length !== 0 )))) {
          this.accessToken = this.subscriptionModel.settings.weezevent.access_token;
          this.encoded_accessToken = this.encodeAccesstoken(this.subscriptionModel.settings.weezevent.access_token);
          this.btnText = 'Re-generate';
        } else {
          this.accessToken = '';
        }
    },
      error => {
        if (!this.appService.isEmptyObject(error.msg) && error.error_code !== 'ERR_WEEZEVENT_GET_101')  {
          this.appToastrService.showError(error.msg || 'Subscription detail failed to get.Please try agian later.');
        }
    });
  }
  showSwal() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Weezevent',
        // html: '<div class="form-group col-md-12 mb-2" style="text-align:left">' +
        //     '<label for="username" >Username *</label>' +
        //     '<input id="username-weezevent" type="text" class="form-control border-primary" placeholder="Username" />' +
        //     '</div>' +
        //     '<div class="form-group col-md-12 mb-2" style="text-align:left">' +
        //     '<label for="password" >Password *</label>' +
        //     '<input id="password-weezevent" type="password" class="form-control border-primary" placeholder="Password" />' +
        //     '</div>' +
        //     '<div class="form-group col-md-12 mb-2" style="text-align:left">' +
        //     '<label for="apikey" >API key *</label>' +
        //     '<input id="apikey-weezevent" type="text" class="form-control border-primary" placeholder="API Key" />' +
        //     '</div>',
        html: '<div class="row">' +
                '<label class="col-md-3 col-form-label">Username *</label>' +
                '<div class="col-md-9">' +
                  '<input id="username-weezevent" type="text" class="form-control border-primary" placeholder="Username" />' +
                '</div>' +
              '</div>' +
              '<div class="row">' +
                '<label class="col-md-3 col-form-label">Password *</label>' +
                '<div class="col-md-9">' +
                  '<input id="password-weezevent" type="password" class="form-control border-primary" placeholder="Password" />' +
                '</div>' +
              '</div>' +
              '<div class="row">' +
                '<label class="col-md-3 col-form-label">API Key *</label>' +
                '<div class="col-md-9">' +
                  '<input id="apikey-weezevent" type="text" class="form-control border-primary" placeholder="API Key" />' +
                '</div>' +
              '</div>',
        showCancelButton: true,
        confirmButtonText: this.btnText,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => swal.isLoading(),
        preConfirm: (() => {
          const postParam = {
            username:  $.trim($('#username-weezevent').val()),
            password: $.trim($('#password-weezevent').val()),
            api_key: $.trim($('#apikey-weezevent').val()),
          };

          if ($.trim($('#username-weezevent').val()) !== '' && $.trim($('#password-weezevent').val()) !== '' &&
          $.trim($('#apikey-weezevent').val()) !== '') {
            this.settingsService.resetAccessToken(postParam, this.susbscriptionId)
            .subscribe(
              (response: any) => {
                if (response.status === 'success') {
                  this.accessToken = response.access_token;
                  this.appToastrService.showSuccess(response.msg);
                } else {
                  this.appToastrService.showError(response.msg || 'Failed to reset access token. Please try again');
                }

                // this.encoded_accessToken = this.encodeAccesstoken(response.accessToken);
                // this.updateSubscriptionAccessToken({
                //   api_key : postParam.api_key,
                //   access_token : this.accessToken
                // });
                // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
              },
              error => {
                this.appToastrService.showError(error.message || 'Failed to get access token. Please try again');
                // swal.showValidationError(error.message || 'Failed to get AccessToken. Please try again.');
            });
          } else {
            swal.showValidationMessage('Please fill all the required details');
          }
        })
    }).then((result) => {
      if (result.value) {
      const postParam = {
        username:  $.trim($('#username-weezevent').val()),
        password: $.trim($('#password-weezevent').val()),
        api_key: $.trim($('#apikey-weezevent').val()),
      };

      // this.accessToken = '1b1a289e92a7f2ea3f60268a542931fb';
      // this.encoded_accessToken = this.encodeAccesstoken(this.accessToken);
      // this.updateSubscriptionAccessToken({
      //   api_key : postParam.api_key,
      //   access_token : this.accessToken
      // });
      } else if ( result.dismiss === swal.DismissReason.cancel) {

      } else {

      }
    }).catch();
  }

  encodeAccesstoken(textValue: any) {
    return textValue.slice(0, 4) + 'XXXXXXXXXXXX';
  }

  setSelectedTab(tabStr) {
    this.selectedTab = tabStr;
  }

  updateSubscriptionAccessToken(weezeventObject: any) {
    const newModel = Object.assign({}, this.subscriptionModel,
      {settings: Object.assign({}, this.subscriptionModel.settings, {weezevent: weezeventObject}), id : this.susbscriptionId});
    console.log(newModel);
    this.updateSubscription(newModel);
  }

  updateSubscription(updateSubscription) {
    this.subscriptionService.updateSubscription(updateSubscription)
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
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
       this.appToastrService.showError(error.msg || 'Subscription detail failed to update.Please try agian later.');
    });
  }

}
