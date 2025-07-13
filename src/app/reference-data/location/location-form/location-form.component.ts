import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../../shared/services/app.service';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../location.service';
import { NgForm } from '@angular/forms';
import * as appAction from '../.././../action/app-actions';
import { Store } from '@ngrx/store';
import { Urls } from './../../../shared/structures/urls';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit, OnDestroy {

  locationModel: any;
  isEdit = false;
  title = 'Add';
  locationId: '';
  imgUploadUrl = '';
  thumbnailurlLogo = '';
  countryList: any[];
  locationSubscription: any;
  codeList: any;

  constructor(private route: ActivatedRoute, public appservice: AppService, private store: Store<any>,
    private locationService: LocationService, private appToastrService: AppToastrService, private urls: Urls) {
      this.imgUploadUrl = this.urls.api['locationImage'];
  }

  ngOnInit() {
    this.codeList = [];
    this.countryList = [];
    this.locationModel = {
      code: '',
      country: '',
      name: {
        fr: '',
        de: '',
        en: ''
      },
      icon: '',
      isAvailable: true,
      sortOrder: -1
    };
    this.locationSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.countryList = s.appMainStore.list_of_country;
    });

    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.locationId = this.route.snapshot.params['id'];
      this.getLocationDetail();
    } else {

    }
  }

  ngOnDestroy() {
    if (!!this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
    if (!!this.locationModel.country) {
      return this.locationService
        .getListOfLocationCode(text$, this.locationModel.country)
        .pipe(
          map(
            data => data
          )
        );
    }
  }

  onAddingCode(item: string) {
    this.locationModel['code'] = item['code'];
  }

  onRemovingCode(item: string) {
    this.locationModel['code'] = '';
  }

  onClearValue() {
    this.appservice.gotoURL('/reference/reflocation');
  }

  getLocationCode(searchTxt) {
    this.locationService.getListOfLocationCode(searchTxt, this.locationModel.country)
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
          this.locationModel.code = response.msg[0]['code'];
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Location detail failed to get.Please try agian later.');
    });
  }

  getLocationDetail() {
    this.locationService.getLocation({id: this.locationId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
          this.locationModel = response.msg;
          this.codeList.push(response.msg.code);
        this.thumbnailurlLogo = !!response.msg.icon ? response.msg.icon : '';
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Location detail failed to get.Please try agian later.');
    });
  }

  onFileUploadEventLogo(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.locationModel.icon = '';
    } else {
      this.locationModel.icon = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  onSubmit(f: NgForm) {
    console.log(this.locationModel);
    if (!this.isEdit && !!this.locationModel.name && !!this.locationModel.country) {
      this.saveLocation();
    } else if (this.isEdit && !!this.locationModel.name && !!this.locationModel.country) {
      const newModel = Object.assign({}, this.locationModel, { id: this.locationId });
      delete newModel['geometry'];
      this.updateLocation(newModel);
    }
  }

  saveLocation() {
    this.locationService.saveLocation(this.locationModel)
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
        this.appToastrService.showError(error.msg || 'Location detail failed to save.Please try again later.');
      });
  }

  updateLocation(updateLocation) {
    this.locationService.updateLocation(updateLocation)
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
      this.appToastrService.showError(error.msg || 'Location detail failed to update.Please try agian later.');
    });
  }

}
