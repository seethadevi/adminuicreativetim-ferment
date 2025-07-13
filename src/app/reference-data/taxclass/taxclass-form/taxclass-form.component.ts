import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { TaxclassService } from './../taxclass.service';
import { NgForm } from '@angular/forms';
import * as appConst from 'src/app/shared/structures/app-constant';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-taxclass-form',
  templateUrl: './taxclass-form.component.html',
  styleUrls: ['./taxclass-form.component.scss']
})
export class TaxclassFormComponent implements OnInit, OnDestroy {
  taxclassModel: any;
  products: any[];
  title = 'Add';
  isEdit = false;
  taxclassId = '';
  taxclassSubscription: any;
  countryList: any[];

  constructor(private appService: AppService, private route: ActivatedRoute, private store: Store<any>,
    private appToastrService: AppToastrService, private taxclasservice: TaxclassService, private router: Router) { }

  ngOnInit() {
    this.taxclassModel = {
      name: '',
      tax_class_percent: 0,
      description: '',
      sub_id : '',
      country: {}
    };
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.taxclassId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.gettaxclassIdDetail();
    } else {

    }

    this.taxclassSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.countryList = s.appMainStore.list_of_country;
          // this.taxclassModel.sub_id = s.appMainStore.subscriptionId;
    });
  }
  ngOnDestroy() {
    if (!!this.taxclassSubscription) {
      this.taxclassSubscription.unsubscribe();
    }
  }

  gettaxclassIdDetail() {
    this.taxclasservice.getTaxclass({id: this.taxclassId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.taxclassModel = response.msg;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Taxclass detail failed to get.Please try agian later.');
    });
  }

  onSubmit(f: NgForm) {
    if ( !!this.taxclassModel.name && !!this.taxclassModel.tax_class_percent) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      if (this.isEdit) {
        const newModel = Object.assign({}, this.taxclassModel, {'id': this.taxclassId});
        this.updateTaxclass(newModel);
      } else {
        this.saveTaxclass();
      }
    }
    // console.log('My saved value', this.taxclassModel);
  }

  selectCountryData(event) {
    let val ;
    if (!!event.target) {
      val = event.target.value;
    } else {
      val = event;
    }
    const countryObjectIdx = this.countryList.findIndex(x => x['seo_name'] === val);
    this.taxclassModel.country = this.countryList[countryObjectIdx];
  }

  saveTaxclass() {
    this.taxclasservice.saveTaxclass(this.taxclassModel)
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        // console.log(error);
        this.appToastrService.showError(error.msg || 'Taxclass detail failed to save.Please try again later.');
      });
  }

  updateTaxclass(updateTaxclass) {
    this.taxclasservice.updateTaxclass(updateTaxclass)
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
      this.appToastrService.showError(error.msg || 'Taxclass detail failed to update.Please try agian later.');
    });
  }

  onClearValue() {
    this.appService.gotoURL('/reference/taxclass');
  }

}
