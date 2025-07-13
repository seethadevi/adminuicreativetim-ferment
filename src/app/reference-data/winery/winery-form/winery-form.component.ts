import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../shared/services/app.service';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { WineryService } from '../winery.service';
import { NgForm } from '@angular/forms';
import * as appAction from '../.././../action/app-actions';
import { Store } from '@ngrx/store';
import { Urls } from './../../../shared/structures/urls';
declare var $: any;

@Component({
  selector: 'app-winery-form',
  templateUrl: './winery-form.component.html',
  styleUrls: ['./winery-form.component.scss']
})
export class WineryFormComponent implements OnInit, OnDestroy {

  wineryModel: any;
  isEdit = false;
  title = 'Add';
  wineryId: '';
  imgUploadUrl = '';
  thumbnailurlLogo = '';
  countryList: any[];
  winerySubscription: any;
  regionList: any[];
  qrURLString: string = null;
  constructor(private route: ActivatedRoute, public appservice: AppService, private store: Store<any>,
    private wineryService: WineryService, private appToastrService: AppToastrService, private urls: Urls) {
      this.imgUploadUrl = this.urls.api['wineryImage'];
  }

  ngOnInit() {
    this.regionList = [];
    this.countryList = [];
    this.winerySubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.countryList = s.appMainStore.list_of_country;
          // console.log(this.countryList);
    });
    this.wineryModel = {
      name: '',
      seo_name: '',
      description: '',
      images: [],
      videos: [],
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      pri_email: '',
      pri_contact_name: '',
      sec_contact_name: '',
      sec_email1: '',
      sec_email2: '',
      sec_email3: '',
      pri_phone: '',
      sec_phone1: '',
      sec_phone2: '',
      sec_phone3: '',
      region: '',
      picture: ''
    };
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.wineryId = this.route.snapshot.params['id'];
      this.qrURLString = this.urls.api['gs1Producer'] + this.wineryId;
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getWineryDetail();
    } else {

    }
  }

  ngOnDestroy() {
    if (!!this.winerySubscription) {
      this.winerySubscription.unsubscribe();
    }
  }

  onClearValue() {
    this.appservice.gotoURL('/reference/winery');
  }

  getWineryDetail() {
    this.wineryService.getWinery({id: this.wineryId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
        $('#printData').find('img').attr('style', 'margin:auto');
        this.wineryModel = response.msg;
        this.thumbnailurlLogo = !!response.msg.picture ? response.msg.picture['md'] : '';
        this.loadCountryData(response.msg.address.country);
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Winery detail failed to get.Please try agian later.');
    });
  }

  onFileUploadEventLogo(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.wineryModel.picture = '';
    } else {
      this.wineryModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  onSubmit(f: NgForm) {
    // console.log(this.wineryModel);
    if (!this.isEdit && !!this.wineryModel.name && !!this.wineryModel.description
      && !!this.wineryModel.address.address1 && !!this.wineryModel.address.city && !!this.wineryModel.address.zip
      && !!this.wineryModel.address.country) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.saveWinery();
    } else if (this.isEdit && !!this.wineryModel.name && !!this.wineryModel.description
      && !!this.wineryModel.address.address1 && !!this.wineryModel.address.city && !!this.wineryModel.address.zip
      && !!this.wineryModel.address.country) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      const newModel = Object.assign( {}, this.wineryModel , { id : this.wineryId});
      this.updateWinery(newModel);
    }
  }

  loadCountryData(event) {
    let val ;
    if (!!event.target) {
      val = event.target.value;
    } else {
      val = event;
    }
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    const selectedCountry = this.countryList.find(s => s.seo_name === val);
    if (!!selectedCountry) {
      this.appservice.loadCountry(selectedCountry.code)
      .subscribe((response: any) => {
          this.regionList = response.data.region;
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Failed to load data for ' + selectedCountry);
      });
    }
  }

  saveWinery() {
    this.wineryService.saveWinery(this.wineryModel)
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
        this.appToastrService.showError(error.msg || 'Winery detail failed to save.Please try again later.');
      });
  }

  updateWinery(updateWinery) {
    this.wineryService.updateWinery(updateWinery)
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
      this.appToastrService.showError(error.msg || 'Winery detail failed to update.Please try agian later.');
    });
  }

  Print(printSectionId) {
    let popupWinindow;
    const innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    let html = '<html><head><style>#printData img{margin:  auto;    padding-top: 20px;}';
    html += '.changetxt {display: none}';
    html +=  '#printData {text-align: center;    padding: 20px;}</style></head>';
    html += '<body onload="window.print()">' + innerContents + '</html>';
    popupWinindow.document.write(html);
    popupWinindow.document.close();
    return false;
  }
}
