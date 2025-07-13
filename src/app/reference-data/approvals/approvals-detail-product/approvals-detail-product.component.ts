import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ApprovalsService } from '../approvals.service';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import * as appAction from 'src/app/action/app-actions';
import { DynamicFormService } from 'src/app/reference-data/dynamic-form/dynamic-form.service';
import { CategoryService } from 'src/app/reference-data/category/category-service';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-approvals-detail-product',
  templateUrl: './approvals-detail-product.component.html',
  styleUrls: ['./approvals-detail-product.component.scss']
})
export class ApprovalsDetailProductComponent implements OnInit, OnDestroy {

  isEdit = false;
  title = 'New';
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  countryProductSetting: any;
  countryList: any[];
  allCategoryList: any[];
  productModel: any;
  winery: any;
  imgUploadUrl = '';
  thumbnailurl = '';
  thumbnailurlLogo = '';
  thumbnailurlLabel = '';
  categoryFormlyDetails: any;
  productId: string;
  productSubscription: any;
  constructor(private route: ActivatedRoute, public appService: AppService, private router: Router, private store: Store<any>,
    private appToastrService: AppToastrService, private approvalsService: ApprovalsService,
    private categoryService: CategoryService, private dynamicFormService: DynamicFormService) {
  }

  ngOnInit(): void {
    this.categoryFormlyDetails = {
      category_type: '',
      dyn_form_component: '',
      std_form_component: ''
    };
    this.winery = { id: '', name : ''};
    this.productModel = {
      country: {
        seo_name: '',
        code: '',
        name: ''
      },
      category_type: {
        id: '',
        type: ''
      },
      name: '',
      description: '',
      winery: '',
      gtin: '',
      label: '',
      picture: '',
      logo: '',
      attr: {},
      attr_value: {},
      ext_attr: {},
      ext_attr_value: {},
      type: 'PRODUCT',
      product_id: ''
    };
    this.productSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.countryList = s.appMainStore.list_of_country;
    });
    if (this.route.snapshot.params['id']) {
      this.productId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getAllCategoryList();
    }
  }

  ngOnDestroy() {
    if (!!this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  onClearValue() {
  this.appService.gotoURL('/reference/approvals');
  }

  getAllCategoryList() {

    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'asc',
      searchvalue: '',
      searchelems: ['type']
    };
    this.categoryService.getCategorysWithPageData(defaultParams)
      .subscribe(
      (response: any) => {
        this.getProductIdDetailApproval();
        if (response.status === 'success') {
          this.allCategoryList = response.res.docs;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Category detail failed to get.');
      });
  }

  getProductIdDetailApproval() {
    this.approvalsService.getApprovalItem({id: this.productId})
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.productModel =  Object.assign({}, this.productModel, response.msg);
        this.productModel.country['seo_name'] = response.msg.country['seo_name'].toUpperCase();
        if ( response.msg.product_id !== undefined && !!response.msg.product_id && response.msg.product_id !== '') {
          this.title = 'Update';
         }
        this.loadCountryData(response.msg.country.seo_name.toUpperCase());
        this.getRequiredFormDetails(response.msg.category_type.type, 'update');
        this.winery = response.msg.winery;
        this.thumbnailurl =  (!!response.msg.picture && !!response.msg.picture['md']) ? response.msg.picture['md'] : '';
        this.thumbnailurlLogo = (!!response.msg.logo && !!response.msg.logo['md']) ? response.msg.logo['md'] : '';
        this.thumbnailurlLabel = (!!response.msg.label && !!response.msg.label['md']) ? response.msg.label['md'] : '';
      } else {
        this.appToastrService.showError(response.msg);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Wine detail failed to get.Please try agian later.');
    });
  }

  loadCountryData(event) {

    let val ;
    if (!!event.target) {
      val = event.target.value;
    } else {
      val = event;
    }

    const countryObjectIdx = this.countryList.findIndex(x => x['seo_name'] === val);
    // console.log(this.countryList);
    this.productModel.country = this.countryList[countryObjectIdx];

    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    const selectedCountry = this.countryList.find(s => s.seo_name === val);

    this.appService.loadCountry(selectedCountry.code)
    .subscribe((response: any) => {
      this.countryProductSetting = response.data;
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Failed to load data for ' + selectedCountry);
    });
  }


  getRequiredFormDetails(event, flag) {
    let category_type ;
    if (!!event.target) {
      category_type = event.target.value;
    } else {
      category_type = event;
    }
    if (category_type === '') {
      this.productModel.category_type['id'] = '';
      this.categoryFormlyDetails = {
        category_type: '',
        dyn_form_component: '',
        std_form_component: ''
      };
      return false;
    }
    const catObjectIdx = this.allCategoryList.filter(x => x['type'] === category_type);
    this.productModel.category_type['id'] = catObjectIdx[0]['id'];

    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.dynamicFormService.getFormWithCategory(category_type)
    .subscribe((response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.categoryFormlyDetails = response.msg;
        if (!!flag) {
          this.setSelectDefaultValue();
        } else {
          this.setCheckboxDefultValue();
        }
        this.mapSelectOptionValues();
        this.mapRadioOptionValues();
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Failed to load data for ' + category_type);
    });
  }

  mapSelectOptionValues() {
    const _this = this;
    // Map Values for the standard Form Field of selected Category type
    const listOfSelectField = _this.categoryFormlyDetails.std_form_component.filter(
      item =>  item.type === 'select' );

    // Loading the values from the country sepecific data
    listOfSelectField.map(item => {
      _this.getField(_this.categoryFormlyDetails.std_form_component, item.key)
        .templateOptions.options = _this.countryProductSetting[item.key].map(
        settingValue => ({ label: settingValue.name, value: settingValue.id}));
    });

    // adding the change event function and update the value for standard
    listOfSelectField.map(item => {
      _this.getField(_this.categoryFormlyDetails.std_form_component, item.key)
      .templateOptions.change = (field, $event) => {
        // const idxValue = field.formControl.value;
        // const idx = _this.countryProductSetting[field['key']].findIndex(x => x['id'] === idxValue);
        const selValue = $event.target.value;
        let selIdx;
        const loopCnt = _this.countryProductSetting[field['key']].length;
        if (selValue.indexOf('0: ') === -1) {
          for (let i = 1; i <= loopCnt; i++) {
           if (selValue.indexOf(i + ': ') !== -1) {
               const replaceValue = selValue.replace(i + ': ', '');
               selIdx = replaceValue;
             }
          }
        }
        if (selIdx !== 'null') {
          const idx = _this.countryProductSetting[field['key']].findIndex(x => x['id'] === selIdx);
          _this.productModel.attr[field['key']] =  _this.countryProductSetting[field['key']][idx];
        }
      };
    });

    // Dynamic field
    const listOfSelectField1 = _this.categoryFormlyDetails.dyn_form_component.filter(
      item =>  item.type === 'select' );

    // adding the change event function and update the value for additional
    listOfSelectField1.map(item => {
      _this.getField(_this.categoryFormlyDetails.dyn_form_component, item.key)
      .templateOptions.change = (field, $event) => {
        const idxValue = field.formControl.value;
        const list = field['templateOptions']['options'];
        let idx = -1, cnt = 0;
        for (const listItem in list) {
          if (!!list[listItem]) {
            if ((list[listItem]['value']) === idxValue) {
              idx = cnt;
            }
            cnt++;
          }
        }
        _this.productModel.ext_attr[field['key']] =  field['templateOptions']['options'][idx];
      };
    });
  }

  mapRadioOptionValues() {
     // Dynamic field
     const listOfSelectField1 = this.categoryFormlyDetails.dyn_form_component.filter(
      item =>  item.type === 'radio' );

    // adding the change event function and update the value for additional
    listOfSelectField1.map(item => {
      this.getField(this.categoryFormlyDetails.dyn_form_component, item.key)
      .templateOptions.change = (field, $event) => {
        const idxValue = field.formControl.value;
        const list = field['templateOptions']['options'];
        let idx = -1, cnt = 0;
        for (const listItem in list) {
          if (!!list[listItem]) {
            if ((list[listItem]['value']) === idxValue) {
              idx = cnt;
            }
            cnt++;
          }
        }
        this.productModel.ext_attr[field['key']] =  field['templateOptions']['options'][idx];
      };
    });
  }

  setCheckboxDefultValue() {
    // Map Values for the standard Form Field of selected Category type
    const listOfcheckboxField = this.categoryFormlyDetails.std_form_component.map(
      item => {
        if (item.type === 'checkbox') {
          this.productModel['attr_value'][item.key] = false;
        }
      });

    const listOfcheckboxField1 = this.categoryFormlyDetails.dyn_form_component.map(
      item => {
        if (item.type === 'checkbox') {
          this.productModel['ext_attr_value'][item.key] = false;
        }
      });
  }

  setSelectDefaultValue() {
    // Map Values for the standard Form Field of selected Category type
    const listOfSelectField = this.categoryFormlyDetails.std_form_component.map(
      item =>  {
      if (item.type === 'select' || item.type === 'radio') {
        if ( !!this.productModel['attr'][item.key]) {
          this.productModel['attr_value'][item.key] = this.productModel['attr'][item.key]['id'].toString();
        }
      } else if (item.type === 'checkbox') {
        if ( !!this.productModel['attr'][item.key]) {
          this.productModel['attr_value'][item.key] = this.productModel['attr'][item.key];
        } else {
          this.productModel['attr_value'][item.key] = false;
        }
      }  else {
        if ( !!this.productModel['attr'][item.key]) {
          this.productModel['attr_value'][item.key] = this.productModel['attr'][item.key].toString();
        }
      }
    });

    const listOfSelectField1 = this.categoryFormlyDetails.dyn_form_component.map(
      item =>  {
        if (item.type === 'select' || item.type === 'radio') {
          if ( !!this.productModel['ext_attr'][item.key]) {
            this.productModel['ext_attr_value'][item.key] = this.productModel['ext_attr'][item.key]['value'].toString();
          }
        } else if (item.type === 'checkbox') {
          if ( !!this.productModel['ext_attr'][item.key]) {
            this.productModel['ext_attr_value'][item.key] = this.productModel['ext_attr'][item.key];
          } else {
            this.productModel['ext_attr_value'][item.key] = false;
          }
        } else {
          if ( !!this.productModel['ext_attr'][item.key]) {
            this.productModel['ext_attr_value'][item.key] = this.productModel['ext_attr'][item.key].toString();
          }
        }
    });
  }

  getField(fields, key: string): FormlyFieldConfig {
    for (let i = 0, len = fields.length; i < len; i++) {
      if (fields[i].key === key) {
        return fields[i];
      }

      if (fields[i].fieldGroup && fields[i].fieldGroup.length > 0) {
        return this.getField(fields[i].fieldGroup, key);
      }
    }
  }

  actionApproval() {
    let selectedRowData;
    if ( this.productModel.product_id !== undefined && !!this.productModel.product_id && this.productModel.product_id !== '') {
      selectedRowData = Object.assign({}, this.productModel , {status: 'APPROVED',  'id': this.productId, action: 'UPDATE'});
    } else {
      selectedRowData = Object.assign({}, this.productModel , {status: 'APPROVED',  'id': this.productId, action: 'ADD'});
    }
    this.updateStatus(selectedRowData);
  }

  actionReject() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Reason to Reject',
        html: '<div class="row">' +
                '<label class="col-md-3 col-form-label">Reason *</label>' +
                '<div class="col-md-9">' +
                  '<textarea id="reason-msg" type="text" row="5" class="form-control border-primary" placeholder="Reason to Reject" ></textarea>' +
                '</div>' +
              '</div>' ,
        showCancelButton: true,
        confirmButtonText: 'Send',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => swal.isLoading(),
        preConfirm: (() => {

          if ($.trim($('#reason-msg').val()) !== '') {
            let selectedRowData;
            if ( this.productModel.product_id !== undefined && !!this.productModel.product_id && this.productModel.product_id !== '') {
              selectedRowData = Object.assign({}, this.productModel, {
                status: 'REJECTED', 'id': this.productId, action: 'UPDATE',
                comments: $.trim($('#reason-msg').val())});
            } else {
              selectedRowData = Object.assign({}, this.productModel, {
                status: 'REJECTED', 'id': this.productId, action: 'ADD',
                comments: $.trim($('#reason-msg').val())});
            }
            console.log(selectedRowData);
            // this.approvalsService.updateApprovalStatus(postParam)
            // .subscribe(
            // (response: any) => {
            //    if (response.status === 'success') {
            //      this.appToastrService.showSuccess(response.msg);
            //      this.onClearValue();
            //    } else {
            //     if (!!response['errors']) {
            //       let errorHtml = '<ul>';
            //       Object.keys(response['errors']).map((item) => {
            //         errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            //       });
            //       errorHtml += '</ul>';
            //       this.appToastrService.typeCustom(errorHtml);
            //     } else {
            //       this.appToastrService.showError(response.msg);
            //     }
            //   }
            // },
            //   error => {
            //   this.appToastrService.showError(error.msg || 'Approval detail failed to Update.Please try again later.');
            // });
          } else {
            swal.showValidationMessage('Please fill reason details');
          }
        })
    }).then((result) => {
      if (result.value) {

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

  updateStatus(postParam) {
    // console.log(postParam);
    this.approvalsService.updateApprovalStatus(postParam)
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
      },
        error => {
        this.appToastrService.showError(error.msg || 'Approval detail failed to Update.Please try again later.');
      });
  }


}
