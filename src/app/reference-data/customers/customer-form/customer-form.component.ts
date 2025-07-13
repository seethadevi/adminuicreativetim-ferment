import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { CustomerModel } from 'src/app/shared/models/customer.model';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { CustomersService } from '../customers.service';
import { NgForm } from '@angular/forms';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit, OnDestroy {

  subscriptionId: Observable<string>;
  customerModel: CustomerModel = {
    subscription_id : '',
    name: '',
    firstname: '',
    lastname: '',
    gender: '',
    dob: '',
    mobile: '',
    mob_reg_id: '',
    email: '',
    password: '',
    confirmpassword: '',
    type: 'CUSTOMER',
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    isSocial: 'FALSE',
    contactSource: 'ADMIN_FERMYNT',
    First_Name: '',
    Last_Name: '',
    Full_Name: '',
    Email: '',
    gdpr: 'TRUE',
  };
  isEdit = false;
  title = 'Add';
  customerId: '';
  customerSubscription: any;
  startDate: any;
  constructor(private route: ActivatedRoute, private store: Store<any>, private appService: AppService,
    private customersService: CustomersService, private appToastrService: AppToastrService) {
    // this.subscriptionId = store.pipe(select((s) => s.appMainStore.subscriptionId));
  }

  ngOnInit() {
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.customerId = this.route.snapshot.params['id'];
      this.getCustomerDetail();
    } else {

    }
    this.customerSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.subscriptionId = s.appMainStore.subscriptionId;
      });
  }

  ngOnDestroy() {
    if (!!this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
  }

  onSubmit(f: NgForm) {
    // TODO - Need to email validation
    if (!this.isEdit && !!this.customerModel.password && !!this.customerModel.firstname &&
      !!this.customerModel.lastname && !!this.customerModel.email
      && (this.customerModel.password === this.customerModel.confirmpassword)) {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.customersService.checkCustomerExist({email: this.customerModel.email.toLowerCase()})
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess('Customer already exists');
        } else {
          this.appToastrService.showError(response.msg);
        }
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        // console.log(error);
        if (!!error.msg && error.msg ===  'No Customer Found' ) {
              const newModel = Object.assign({}, this.customerModel, {
                First_Name: this.customerModel.firstname,
                Last_Name: this.customerModel.lastname,
                Full_Name: this.customerModel.firstname + ' ' + this.customerModel.lastname,
                Email: this.customerModel.email.toLowerCase(),
                email: this.customerModel.email.toLowerCase()
              });
            this.saveCustomer(newModel);
        } else {
          this.appToastrService.showError(error.msg || 'Customer detail failed to save.Please try again later.');
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
      });

    } else if (this.isEdit && !!this.customerModel.firstname &&
      !!this.customerModel.lastname && !!this.customerModel.email ) {
      const newModel = Object.assign( {}, this.customerModel , {
        id : this.customerId,
        First_Name: this.customerModel.firstname,
        Last_Name: this.customerModel.lastname,
        Full_Name: this.customerModel.firstname + ' ' + this.customerModel.lastname,
        Email: this.customerModel.email.toLowerCase(),
        email: this.customerModel.email.toLowerCase()
      });
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.updateCustomer(newModel);
    }
  }

  getFormatedDate(dateValue) {
    return dateValue.year + '-' + dateValue.month + '-' + dateValue.day;
  }

  saveCustomer(newModel) {
    this.customersService.saveContact(newModel)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
        } else {
          this.appToastrService.showError(response.msg);
        }
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Customer detail failed to save.Please try again later.');
      });
  }

  updateCustomer(updateCustomer) {
    this.customersService.updateCustomer(updateCustomer)
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Customer detail failed to update.Please try agian later.');
    });
  }

  getCustomerDetail() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.customersService.getCustomers({id: this.customerId})
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.customerModel = Object.assign({}, this.customerModel, response.msg);
        if (!response.msg.address) {
          this.customerModel['address'] = {
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          };
        }
        // console.log('My dat', this.customerModel);
        // if(!!response.msg.dob){
        //   this.startDate = this.createDateOject(response.msg.dob);
        // }
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Customer detail failed to get.Please try agian later.');
    });
  }

  createDateOject(value) {
    const object1 = value.split('T');
    const object2 = object1[0].split('-');
    return { 'year': parseInt(object2[0], 10), 'month': parseInt(object2[1], 10), 'day': parseInt(object2[2], 10) };
  }

  onClearValue() {
    this.appService.gotoURL('/reference/customer');
  }

}
