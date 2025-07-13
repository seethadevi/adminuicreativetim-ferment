import { Component, OnInit, OnDestroy } from '@angular/core';
import { Urls } from 'src/app/shared/structures/urls';
import { EmployeeService } from '../employee.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { NgForm } from '@angular/forms';
import { ShopService } from 'src/app/shop/shop.service';
import * as appAction from 'src/app/action/app-actions';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MAX_SELETC_SHOP_COUNT = 10;
const MIN_SELETC_SHOP_COUNT = 1;

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {

  employeeModel: any;
  updatePwd: any;
  products: any[];
  title = 'Add';
  isEdit = false;
  employeeId = '';
  employeeSubscription: any;
  endDate: any;
  startDate: any;
  allSubsShopList: any;
  imgUploadUrl = '';
  thumbnailurl = '';
  closeResult = '';
  changePwdClick = false;
  public shopsListStaff: any[];
  public shopsListManager: any[];
  maxItemCountManager = MAX_SELETC_SHOP_COUNT;
  maxItemCountStaff = MAX_SELETC_SHOP_COUNT;
  sub_id = '';
  constructor(private urls: Urls, private employeeservice: EmployeeService, private shopService: ShopService,
    private appToastrService: AppToastrService, private store: Store<any>, private modalService: NgbModal,
    private route: ActivatedRoute, public appService: AppService) {
      this.imgUploadUrl = this.urls.api['employeeImage'];
    }

  ngOnInit() {
    this.allSubsShopList = [
      {
        id: '',
        name: 'Select Shop'
      }
    ];
    this.updatePwd = {
      employeeId: '',
      password: '',
      confirmpassword: '',
      sub_id: ''
    };
    this.shopsListStaff = [];
    this.shopsListManager = [];
    // this.shopsListStaff = [{id: 'all', name: 'ALL', _id: 'all', picture: {sm: 'assets/img/defaults/pop-up-store-icon.png',
    // md: 'assets/img/defaults/pop-up-store-icon.png' , lg: 'assets/img/defaults/pop-up-store-icon.png'}}];
    // this.shopsListManager = [{id: 'all', name: 'ALL', _id: 'all', picture: {sm: 'assets/img/defaults/pop-up-store-icon.png',
    // md: 'assets/img/defaults/pop-up-store-icon.png' , lg: 'assets/img/defaults/pop-up-store-icon.png'}}];
    this.sub_id = '';
    this.employeeModel = {
      sub_id: '',
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      email: '',
      picture: '',
      status: 'A',
      mobile: '',
      accessToShop: []
    };
    this.employeeSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.employeeModel.sub_id = s.appMainStore.subscriptionId;
          this.sub_id = s.appMainStore.subscriptionId;
          this.updatePwd.sub_id = s.appMainStore.subscriptionId;
    });
    // this.getAllShopOfSub();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.employeeId = this.route.snapshot.params['id'];
      this.updatePwd.id = this.employeeId;
      this.getEmployeeIdDetail();
    } else {
    }
  }

  ngOnDestroy() {
    if (!!this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

  onFileUploadEvent(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.employeeModel.picture = '';
    } else {
      this.employeeModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  // getAllShopOfSub() {
  //   this.shopService.getSubShop({id: this.employeeModel.sub_id})
  //   .subscribe(
  //     (response: any) => {
  //       if (response.status === appConst.SUCCESS) {
  //         this.allSubsShopList = response.res.docs;
  //         this.allSubsShopList.unshift({ id: '', name: 'Select Shop' });
  //       } else {
  //         this.appToastrService.showError(response.msg);
  //       }
  //       if ( !this.isEdit ) {
  //         this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
  //       }
  //     },
  //     error => {
  //       // console.log(error);
  //       this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
  //       this.appToastrService.showError(error.msg || 'Shop detail failed to get.Please try agian later.');
  //     });
  // }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
   return this.shopService
      .getShopsWithPageData(text$, this.sub_id)
      .pipe(
        map(
          data => {
            const newData = [{id: 'all', name: 'ALL', _id: 'all', picture: {sm: 'assets/img/defaults/pop-up-store-icon.png',
            md: 'assets/img/defaults/pop-up-store-icon.png' , lg: 'assets/img/defaults/pop-up-store-icon.png'}}];
            if (!!data.length) {
              newData.push(data[0]);
            }
            return newData;
          }
        )
      );
  }

  onAddingShop(item: Object, typeOfRole: string) {
    if (!!item && !!item['id'] && item['id'] === 'all') {
      if (typeOfRole === 'MANAGER') {
        this.shopsListManager = [];
        this.shopsListManager.push(item);
        this.maxItemCountManager = MIN_SELETC_SHOP_COUNT;
      } else {
        this.shopsListStaff = [];
        this.shopsListStaff.push(item);
        this.maxItemCountStaff = MIN_SELETC_SHOP_COUNT;
      }
    } else {
      if (typeOfRole === 'MANAGER') {
        this.maxItemCountManager = MAX_SELETC_SHOP_COUNT;
      } else {
        this.maxItemCountStaff = MAX_SELETC_SHOP_COUNT;
      }
      return false;
    }
   //  console.log('New saved Value', this.warehouseProdModel);
  }

  onRemovingShop(item: Object, typeOfRole: string) {
    if (!!item && !!item['id'] && item['id'] === 'all') {
      if (typeOfRole === 'MANAGER') {
        this.shopsListManager = [];
         this.maxItemCountManager = MAX_SELETC_SHOP_COUNT;
      } else {
        this.shopsListStaff = [];
        this.maxItemCountStaff = MAX_SELETC_SHOP_COUNT;
      }
    } else {
      return false;
    }
  }

  getEmployeeIdDetail() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.employeeservice.getEmployee({id: this.employeeId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.employeeModel = response.msg;
        this.thumbnailurl = !!response.msg.picture ? response.msg.picture['md'] : '';
        if (!!response.msg.accessToShop && !!response.msg.accessToShop.length) {
          const idxManager = response.msg.accessToShop.findIndex(x => x['role'] === 'MANAGER');
          const idxStaff = response.msg.accessToShop.findIndex(x => x['role'] === 'STAFF');
          if (idxManager !== -1) {
            this.shopsListManager = !!response.msg.accessToShop[idxManager]['permissions']
            ? response.msg.accessToShop[idxManager]['permissions'] : [];
          } else {
            this.shopsListManager = [];
          }
          if  ( idxStaff !== -1) {
            this.shopsListStaff = !!response.msg.accessToShop[idxStaff]['permissions'] ?
              response.msg.accessToShop[idxStaff]['permissions'] : [];
          } else {
            this.shopsListStaff = [];
          }
        }
      } else {
        this.appToastrService.showError(response.msg);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Employee detail failed to get.Please try agian later.');
    });
  }
  hideLoading() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
  }

  onSubmit(f: NgForm) {
    const shopRoleMangaer = {
      role: 'MANAGER',
      permissions: []
    };
    const shopRoleStaff = {
      role: 'STAFF',
      permissions: []
    };
    if ( !!this.shopsListManager  && !!!!this.shopsListManager.length) {
      shopRoleMangaer['permissions'] = this.shopsListManager;
    }
    if ( !!this.shopsListStaff  && !!!!this.shopsListStaff.length) {
      shopRoleStaff['permissions'] = this.shopsListStaff;
    }
    this.employeeModel.accessToShop = [];
    this.employeeModel.accessToShop.push(shopRoleMangaer);
    this.employeeModel.accessToShop.push(shopRoleStaff);

    if (!this.isEdit && !!this.employeeModel.username && !!this.employeeModel.firstname && !!this.employeeModel.lastname
      && !!this.employeeModel.email && !!this.employeeModel.mobile && !!this.employeeModel.password &&
      !!this.employeeModel.confirmpassword && this.employeeModel.password === this.employeeModel.confirmpassword
      && !!this.employeeModel.accessToShop && !!this.employeeModel.accessToShop.length) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
        this.saveEmployee();
      } else if (this.isEdit && !!this.employeeModel.username && !!this.employeeModel.firstname && !!this.employeeModel.lastname
      && !!this.employeeModel.email && !!this.employeeModel.mobile
      && !!this.employeeModel.accessToShop && !!this.employeeModel.accessToShop.length) {
        const newModel = Object.assign({}, this.employeeModel, {'id': this.employeeId});
        this.updateEmployee(newModel);
      }
    // console.log('My saved value', this.employeeModel);
  }
// Model: "2018-11-09T06:30:00.000Z"
  getFormatedDate(dateValue) {
    return dateValue.year + '-' + dateValue.month + '-' + dateValue.day;
  }

  saveEmployee() {
    this.employeeservice.saveEmployee(this.employeeModel)
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
        this.appToastrService.showError(error.msg || 'Employee detail failed to save.Please try again later.');
      });
  }

  updateEmployee(updateEmployee) {
    this.employeeservice.updateEmployee(updateEmployee)
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
      this.appToastrService.showError(error.msg || 'Employee detail failed to update.Please try agian later.');
    });
  }

  onClearValue() {
    this.appService.gotoURL('subscriptionhome/employee');
  }

  updateNewPassword() {
    this.changePwdClick = true;
    if (!!this.updatePwd.password && !!this.updatePwd.confirmpassword && this.updatePwd.password === this.updatePwd.confirmpassword) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.employeeservice.updateEmployeePwd(this.updatePwd)
      .subscribe(
      (response: any) => {
        this.changePwdClick = false;
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          // this.onClearValue();
          this.modalService.dismissAll('Close popup after Save.');
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
        this.changePwdClick = false;
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Employee password failed to save.Please try again later.');
      });
    }
  }

  openTypeSelectionModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
