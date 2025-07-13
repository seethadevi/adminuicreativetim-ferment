import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from 'src/app/shared/services/app.service';
import { Urls } from 'src/app/shared/structures/urls';
import { VendorsubService } from '../vendorsub.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as appConst from 'src/app/shared/structures/app-constant';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-vendorsub-form',
  templateUrl: './vendorsub-form.component.html',
  styleUrls: ['./vendorsub-form.component.scss']
})
export class VendorsubFormComponent implements OnInit, OnDestroy {

  title = 'Add';
  vendorModel: any;
  isEdit = false;
  vendorSubscription: any;
  vendorId = '';
  imgUploadUrl = '';
  thumbnailurl = '';
  constructor(private urls: Urls, private vendorservice: VendorsubService,
  private appToastrService: AppToastrService, private store: Store<any>,
  private route: ActivatedRoute, public appService: AppService) {
    this.imgUploadUrl = this.urls.api['vendorImage'];
  }

  ngOnInit() {
    this.vendorModel = {
      name: '',
      status: 'A',
      description: '',
      accNo: '',
      url: '',
      email: '',
      mobile: '',
      address: {
        address1: '',
        address2: '',
        state: '',
        city: '',
        zip: '',
        country: ''
      },
      picture: '',
      country: '',
      sub_id: '',
      isCentral: 'FALSE'
    };
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.vendorId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getVendorIdDetail();
    } else {

    }
    this.vendorSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.vendorModel.sub_id = s.appMainStore.subscriptionId;
    });
  }

  ngOnDestroy() {
    if (!!this.vendorSubscription) {
      this.vendorSubscription.unsubscribe();
    }
  }

  onFileUploadEvent(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.vendorModel.picture = '';
    } else {
      this.vendorModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  getVendorIdDetail() {
    this.vendorservice.getVendor({id: this.vendorId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.vendorModel = response.msg;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Vendor detail failed to get.Please try agian later.');
    });
  }

  onSubmit(f: NgForm) {
    if (!!this.vendorModel.name && !!this.vendorModel.mobile && !!this.vendorModel.email
      && !!this.vendorModel.address.address1 && !!this.vendorModel.address.city && !!this.vendorModel.address.country
      && !!this.vendorModel.address.zip) {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
        if (this.isEdit) {
          const newModel = Object.assign({}, this.vendorModel, {'id': this.vendorId});
          this.updateVendor(newModel);
        } else {
          this.saveVendor();
        }

      }
    console.log('My saved value', this.vendorModel);
  }

  saveVendor() {
    this.vendorservice.saveVendor(this.vendorModel)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Vendor detail failed to save.Please try again later.');
      });
  }

  updateVendor(updateVendor) {
    this.vendorservice.updateVendor(updateVendor)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Vendor detail failed to update.Please try agian later.');
    });
  }

  onClearValue() {
    this.appService.gotoURL('subscriptionhome/vendorsub');
  }

}
