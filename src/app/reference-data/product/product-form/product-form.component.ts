import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { AppService } from './../../../shared/services/app.service';
import { Urls } from './../../../shared/structures/urls';
import { WineryService } from './../../winery/winery.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { ProductService } from './../ProductService';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge } from 'rxjs/operators';
import * as appAction from 'src/app/action/app-actions';
import * as appConst from 'src/app/shared/structures/app-constant';
import { CategoryService } from './../../category/category-service';
import { DynamicFormService } from './../../dynamic-form/dynamic-form.service';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  isEdit = false;
  title = 'Add';
  constructor(private store: Store<any>, public appService: AppService, private appToastrService: AppToastrService,
    private route: ActivatedRoute, private wineryService: WineryService, private urls: Urls,
    private productService: ProductService, private categoryService: CategoryService, private dynamicFormService: DynamicFormService) {
      this.imgUploadUrl = this.urls.api['wineImage'];
  }
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
  searching = false;
  searchFailed = false;
  productSubscription: any;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  categoryFormlyDetails: any;
  productErrors: any;
  productId: string;
  producerServerList: any;
  dropdownconfig = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    search: true,
    height: '300px',
    placeholder: 'Producer',
    noResultsFound: 'No Producer found!',
    searchPlaceholder: 'Search Producer',
    searchOnKey: 'name',
    clearOnSelection: true,
    inputDirection: 'ltr'
  };
  ngOnInit() {
    this.productSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.countryList = s.appMainStore.list_of_country;
    });
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
      category_id: '',
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
      ext_attr_value: {}
    };
    this.productErrors = {};
    this.categoryFormlyDetails = {
      category_type: '',
      dyn_form_component: '',
      std_form_component: ''
    };
    this.getAllProducerListCount();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.productId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getAllCategoryList();
    } else {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getAllCategoryList();
      this.productId = '';
      this.winery = { id: '', name: ''};
    }
  }

  getProductIdDetail() {
    this.productService.getProducts({id: this.productId})
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.productModel =  Object.assign({}, this.productModel, response.msg);
        this.productModel.country['seo_name'] = response.msg.country['seo_name'].toUpperCase();
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

  ngOnDestroy() {
    if (!!this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
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
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        } else {
          this.getProductIdDetail();
        }
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

  getAllProducerListCount() {

    const defaultParams = {
      page: 1,
      limit: 1,
      sortkey: '',
      sortorderstring: 'asc',
      searchvalue: '',
      searchelems: ['']
    };
    this.wineryService.getWinerysWithPageData(defaultParams)
      .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.getAllProducerList(response.res.total);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
      });
  }

  getAllProducerList(producerCnt) {
  const defaultParams = {
    page: 1,
    limit: producerCnt,
    sortkey: '',
    sortorderstring: 'asc',
    searchvalue: '',
    searchelems: ['']
  };
  this.wineryService.getWinerysWithPageData(defaultParams)
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.producerServerList = response.res.docs;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
    });
  }

  selectionChanged(event) {
    if (!!event.value) {
      this.productModel['logo'] = !!event.value.picture ? event.value.picture : '';
      this.thumbnailurlLogo = !!event.value.picture ? event.value.picture['md'] : '';
      this.productModel.winery = {
        name: event.value.name,
        id: event.value.id
      };
    }
  }
  // producerSearch = (text$: Observable<string>) =>
  //   text$.pipe(
  //   debounceTime(300),
  //   distinctUntilChanged(),
  //   tap(() => this.searching = true),
  //   switchMap(term =>
  //     this.wineryService.getWinerysWithPageData(term).pipe(
  //       tap(() => this.searchFailed = false),
  //       catchError(() => {
  //         this.searchFailed = true;
  //         return of([]);
  //       }))
  //   ),
  //   tap(() => this.searching = false),
  //   merge(this.hideSearchingWhenUnsubscribed)
  // )

  // selectedProducer(event) {
  //   if (!!event.item) {
  //     this.productModel['logo'] = !!event.item.picture ? event.item.picture : '';
  //     this.thumbnailurlLogo = !!event.item.picture ? event.item.picture['md'] : '';
  //     this.productModel.winery = {
  //       name: event.item.name,
  //       id: event.item.id
  //     };
  //   }
  // }
  // formatter = (x: {name: string}) => x.name;

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
      if (!!event.target) {
        this.productModel.category_type.type = '';
        this.getRequiredFormDetails('', ''); // Reset the category to null or empty
      }
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
      this.productModel.category_id = '';
      this.categoryFormlyDetails = {
        category_type: '',
        dyn_form_component: '',
        std_form_component: ''
      };
      return false;
    }
    const catObjectIdx = this.allCategoryList.filter(x => x['type'] === category_type);
    this.productModel.category_type['id'] = catObjectIdx[0]['id'];
    this.productModel.category_id = catObjectIdx[0]['id'];

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
        settingValue => ({ label: settingValue.name, value: settingValue.id }));
    });

    // adding the change event function and update the value for standard
    listOfSelectField.map(item => {
      _this.getField(this.categoryFormlyDetails.std_form_component, item.key)
      .templateOptions.change = (field, $event) => {
        // const idxValue = field.formControl.value;
        // const idx = this.countryProductSetting[field['key']].findIndex(x => x['id'] === idxValue);
        // this.productModel.attr[field['key']] =  this.countryProductSetting[field['key']][idx];
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
        this.productModel.ext_attr[field['key']] =  field['templateOptions']['options'][idx];
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

  onFileUploadEvent(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.productModel.picture = '';
    } else {
      this.productModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }
  onFileUploadEventLogo(event: any) {
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.productModel.logo = '';
    } else {
      this.productModel.logo = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }
  onFileUploadEventLabel(event: any) {
  // console.log(event);
  if (event.status === -1) {
    this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.productModel.label = '';
    } else {
      this.productModel.label = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }

  onSubmit(f: NgForm) {
    console.log('my Saved Data', this.productModel);
    if ( !!this.productModel.country.seo_name && !!this.productModel.category_type.type
      && !!this.productModel.name && this.productModel.description && !!this.productModel.winery.name) {
        // Update the attr_value and ext_attr_value of text box to Product model
        this.categoryFormlyDetails.std_form_component.map(item => {
           if (item.type !== 'select' && item.type !== 'radio') {
            this.productModel.attr[item.key] = this.productModel.attr_value[item.key];
           }
        });
        this.categoryFormlyDetails.dyn_form_component.map(item => {
          if (item.type !== 'select' && item.type !== 'radio') {
           this.productModel.ext_attr[item.key] = this.productModel.ext_attr_value[item.key];
          }
       });
        console.log('my Saved Data', this.productModel);
        if ((this.productModel.category_type.type).toLowerCase() === 'wine' && !!this.productModel.attr.year) {
          this.productModel = Object.assign({}, this.productModel, {
            displayName: this.productModel.name + ' ' + this.productModel.attr.year });
        } else {
          this.productModel = Object.assign({}, this.productModel, {
            displayName: this.productModel.name });
        }
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
        if (!this.isEdit) {
          this.saveProduct();
        } else if (this.isEdit) {
          const newModel = Object.assign({}, this.productModel, {'id': this.productId});
          this.updateProduct(newModel);
        }
    }
  }

  saveProduct() {
    this.productService.saveProduct(this.productModel)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
        } else {
          if (!!response['errors']) {
            this.productErrors = response.errors;
            let errorHtml = '<ul>';
            Object.keys(response['errors']).map((item) => {
              errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            });
            errorHtml += '</ul>';
            this.appToastrService.typeCustom(errorHtml);
          } else {
            this.appToastrService.showError(response.msg);
          }
          // console.log(this.wineErrors);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Product detail failed to save.Please try again later.');
      });
  }

  updateProduct(updateWine) {
    this.productService.updateProduct(updateWine)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        if (!!response['errors']) {
          this.productErrors = response.errors;
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
      this.appToastrService.showError(error.msg || 'Wine detail failed to update.Please try agian later.');
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

  onClearValue() {
    this.appService.gotoURL('/reference/product');
  }
}
