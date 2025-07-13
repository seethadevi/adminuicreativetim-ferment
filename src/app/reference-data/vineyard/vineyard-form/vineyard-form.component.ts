import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';
import { AppToastrService } from '../../../shared/services/app-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { VineyardService } from '../vineyard.service';
import { NgForm } from '@angular/forms';
import * as appAction from '../../../action/app-actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-vineyard-form',
  templateUrl: './vineyard-form.component.html',
  styleUrls: ['./vineyard-form.component.scss']
})
export class VineyardFormComponent implements OnInit {

  vineyardModel: any;
  isEdit = false;
  title = 'Add';
  vineyardId: '';
  constructor(private route: ActivatedRoute, private appservice: AppService, private store: Store<any>,
    private vineyardService: VineyardService, private appToastrService: AppToastrService) {
  }

  ngOnInit() {
    this.vineyardModel = {
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
      }
    };
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.vineyardId = this.route.snapshot.params['id'];
      this.getVineyardDetail();
    } else {

    }
  }

  onClearValue() {
    this.appservice.gotoURL('reference/vineyard');
  }

  getVineyardDetail() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.vineyardService.getVineyards({id: this.vineyardId})
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.vineyardModel = response.msg;
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Vineyard detail failed to get.Please try agian later.');
    });
  }

  onSubmit(f: NgForm) {
    if (!this.isEdit && !!this.vineyardModel.name && !!this.vineyardModel.description
      && !!this.vineyardModel.address.address1 && !!this.vineyardModel.address.city && !!this.vineyardModel.address.zip
      && !!this.vineyardModel.address.country) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.saveVineyard();
    } else if (this.isEdit && !!this.vineyardModel.name && !!this.vineyardModel.description
      && !!this.vineyardModel.address.address1 && !!this.vineyardModel.address.city && !!this.vineyardModel.address.zip
      && !!this.vineyardModel.address.country) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      const newModel = Object.assign( {}, this.vineyardModel , { id : this.vineyardId});
      this.updateVineyard(newModel);
    }
  }

  saveVineyard() {
    this.vineyardService.saveVineyard(this.vineyardModel)
      .subscribe(
      (response: any) => {
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Vineyard detail failed to save.Please try again later.');
      });
  }

  updateVineyard(updateVineyard) {
    this.vineyardService.updateVineyard(updateVineyard)
    .subscribe(
    (response: any) => {
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
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Vineyard detail failed to update.Please try agian later.');
    });
  }

}
