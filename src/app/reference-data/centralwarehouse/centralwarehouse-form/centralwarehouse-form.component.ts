import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { CentralwarehouseService } from '../centralwarehouse.service';
import { NgForm } from '@angular/forms';
import * as appConst from 'src/app/shared/structures/app-constant';
import { AppService } from 'src/app/shared/services/app.service';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-centralwarehouse-form',
  templateUrl: './centralwarehouse-form.component.html',
  styleUrls: ['./centralwarehouse-form.component.scss']
})
export class CentralwarehouseFormComponent implements OnInit {

  title: String = '';
  isEdit: Boolean = false;
  warehouseId: string;
  warehouseModel: any;
  sub_id = '';
  constructor(private route: ActivatedRoute, private store: Store<any>, private appService: AppService,
    private appToastrService: AppToastrService, private centralwarehouseService: CentralwarehouseService) { }

  ngOnInit() {
    this.warehouseModel = {
      name: '',
      description: '',
      status: 'A',
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
      this.warehouseId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getWarehouseDetail();
    } else {
      this.title = 'Add';
    }
  }

  getWarehouseDetail() {
    this.centralwarehouseService.getCentralWarehouse({id: this.warehouseId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === appConst.SUCCESS) {
        this.warehouseModel = response.msg;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      // console.log(error);
      this.appToastrService.showError(error.msg || 'CentralWarehouse detail failed to get.Please try agian later.');
    });
   }

   onSubmit(f: NgForm) {
     if (!!this.warehouseModel.name && !!this.warehouseModel.description && !!this.warehouseModel.address.address1
       && !!this.warehouseModel.address.city && !!this.warehouseModel.address.zip
      && !!this.warehouseModel.address.country) {
        if (this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
          const newModel = Object.assign({}, this.warehouseModel, {'id': this.warehouseId});
          this.updateWarehouse(newModel);
        } else {
          this.saveWarehouse();
        }
      }
   }

   saveWarehouse() {
    this.centralwarehouseService.saveCentralWarehouse(this.warehouseModel)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === appConst.SUCCESS) {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'centralwarehouse product detail failed to save.Please try again later.');
    });
   }

   updateWarehouse(updateRepository) {
    this.centralwarehouseService.updateCentralWarehouse(updateRepository)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === appConst.SUCCESS) {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'CentralWarehouse detail failed to update.Please try agian later.');
    });
  }

   onClearValue() {
     this.appService.gotoURL('reference/centralwarehouse');
   }
}
