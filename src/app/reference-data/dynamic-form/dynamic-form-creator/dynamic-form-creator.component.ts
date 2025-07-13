import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Urls } from 'src/app/shared/structures/urls';
import { Observable, of } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as appConst from 'src/app/shared/structures/app-constant';
import { CategoryService } from 'src/app/category/category.service';
import * as appAction from 'src/app/action/app-actions';
import { DynamicFormService } from '../dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-creator',
  templateUrl: './dynamic-form-creator.component.html',
  styleUrls: ['./dynamic-form-creator.component.scss']
})
export class DynamicFormCreatorComponent implements OnInit {

  title = 'Add';
  dynamicFormModel: any;
  isEdit = false;
  dynamicFormId = '';
  dynamicSubscription: any;
  closeResult: string;
  appConstValue: any;
  currentSelectedFieldType = '';
  dynamicFormObject = [];
  currentFieldValue: any;
  selectCatgoryConst = 'Select Category';
  allCategoryList: any[];
  isSaveClick = false;
  constructor(private urls: Urls, private store: Store<any>, private appToastrService: AppToastrService,
    private route: ActivatedRoute, private appService: AppService, private modalService: NgbModal
    , private categoryService: CategoryService, private dynamicFormService: DynamicFormService) { }

  ngOnInit() {
    this.dynamicFormModel = {
      // name: '',
      category_type: '',
      std_form_component: [],
      dyn_form_component: []
    };
    this.allCategoryList = [
      {type: this.selectCatgoryConst}
    ];
    this.currentFieldValue = {
      strname: '',
      strRequired: false,
      strDisplay: false,
      strkey: '',
      numname: '',
      numkey: '',
      numRequired: false,
      numDisplay: false,
      selkey: '',
      selname: '',
      seloptions: [],
      selRequired: false,
      selDisplay: false,
      chkname: '',
      chkRequired: false,
      chkDisplay: false,
      rdname: '',
      rdRequired: false,
      rdDisplay: false,
      rdoptions: [],
    };
    this.appConstValue = appConst;
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.getAllCategoryList();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.dynamicFormId = this.route.snapshot.params['id'];
      this.getDynamicIdDetail();
    } else {
      // DO nothing
    }
  }

  getDynamicIdDetail() {
    this.dynamicFormService.getDynamicForm({id: this.dynamicFormId})
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        // Always update the std_form_compoenet from the JSON
        this.dynamicFormModel = {
          category_type: response.msg.category_type,
          std_form_component: [],
          dyn_form_component: response.msg.dyn_form_component
        };
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.getStdFromCmp(response.msg.category_type);
      } else {
        this.appToastrService.showError(response.msg);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Dynamic form detail failed to get.Please try agian later.');
    });
  }

  onClearValue() {
    this.appService.gotoURL('/reference/dynamicform');
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
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          this.allCategoryList = response.res.docs;
          this.allCategoryList.unshift({type: this.selectCatgoryConst });
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

  getRequiredFormDetails(event) {
    let value ;
    if (!!event.target) {
      value = event.target.value;
    } else {
      value = this.dynamicFormModel.category_type;
    }
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.getStdFromCmp(value);
  }

  getStdFromCmp(cat_type) {
    this.appService.getStdFormFieldData(cat_type.toLowerCase())
    .subscribe((response: any) => {
      if (!!response.data && !!response.data.length) {
        this.dynamicFormModel.std_form_component = response.data;
      } else {
        this.dynamicFormModel.std_form_component = [];
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
     },
    error => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Failed to load data for ' + cat_type);
     });
  }

  selectFieldType(typecontent, type) {
    // console.log('selectedtype', type);
    this.currentSelectedFieldType = type;
    this.modalService.dismissAll('Open new Popup');
    this.modalService.open(typecontent, {ariaLabelledBy: 'modal-basic-title1'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  saveFormlyFieldValue() {
    this.isSaveClick = true;
    let fieldFormatValue = {};
    // Validation
    if (this.currentSelectedFieldType === this.appConstValue.STR_STRING && !this.currentFieldValue.strname) {
      return false;
    }

    if (this.currentSelectedFieldType === this.appConstValue.STR_NUMBER && !this.currentFieldValue.numname) {
      return false;
    }

    if (this.currentSelectedFieldType === this.appConstValue.STR_SELECT && !this.currentFieldValue.selname
      && !this.currentFieldValue.seloptions.length) {
      return false;
    }

    if (this.currentSelectedFieldType === this.appConstValue.STR_CHECKBOX && !this.currentFieldValue.chkname) {
      return false;
    }

    if (this.currentSelectedFieldType === this.appConstValue.STR_RADIO && !this.currentFieldValue.rdname
      && !this.currentFieldValue.rdoptions.length) {
      return false;
    }

    if (this.currentSelectedFieldType === this.appConstValue.STR_STRING && !!this.currentFieldValue.strname) {
      fieldFormatValue = {
        key: this.currentFieldValue.strname.toLowerCase().replace(/ /g, '_'),
        type: 'input',
        isDisplay: this.currentFieldValue.strDisplay,
        templateOptions: {
          type: 'text',
          label: this.currentFieldValue.strname.toUpperCase(),
          placeholder: this.currentFieldValue.strname,
          required: this.currentFieldValue.strRequired
        }
      };
      this.dynamicFormModel.dyn_form_component.push(fieldFormatValue);
      this.currentFieldValue = Object.assign({}, this.currentFieldValue, { strname : '', strDisplay: false, strRequired: false});
    } else if (this.currentSelectedFieldType === this.appConstValue.STR_NUMBER) {
      fieldFormatValue = {
        key: this.currentFieldValue.numname.toLowerCase().replace(/ /g, '_'),
        type: 'input',
        isDisplay: this.currentFieldValue.numDisplay,
        templateOptions: {
          type: 'number',
          label: this.currentFieldValue.numname.toUpperCase(),
          placeholder: this.currentFieldValue.numname,
          required: this.currentFieldValue.numRequired
        }
      };
      this.dynamicFormModel.dyn_form_component.push(fieldFormatValue);
      this.currentFieldValue.numname = '';
      this.currentFieldValue = Object.assign({}, this.currentFieldValue, { numname : '', numDisplay: false, numRequired: false});
    } else if (this.currentSelectedFieldType === this.appConstValue.STR_SELECT) {
      // const optionsValues = this.currentFieldValue.seloptions.split(',');
      // const optionsArray = optionsValues.map((item, idx) => {
      //   return {label: item, value : idx };
      // });
      fieldFormatValue = {
        key: this.currentFieldValue.selname.toLowerCase().replace(/ /g, '_'),
        type: 'select',
        isDisplay: this.currentFieldValue.selDisplay,
        templateOptions: {
          type: 'select',
          label: this.currentFieldValue.selname.toUpperCase(),
          placeholder: this.currentFieldValue.selname,
          required: this.currentFieldValue.selRequired,
          options: this.currentFieldValue.seloptions
        }
      };
      this.dynamicFormModel.dyn_form_component.push(fieldFormatValue);
      // this.currentFieldValue.selname = '';
      // this.currentFieldValue.seloptions = '';
      this.currentFieldValue = Object.assign({}, this.currentFieldValue,
        { selname : '', selDisplay: false, selRequired: false, seloptions: ''});
    } else if (this.currentSelectedFieldType === this.appConstValue.STR_CHECKBOX) {
      fieldFormatValue = {
        key: this.currentFieldValue.chkname.toLowerCase().replace(/ /g, '_'),
        type: 'checkbox',
        isDisplay: this.currentFieldValue.chkDisplay,
        templateOptions: {
          type: 'checkbox',
          label: this.currentFieldValue.chkname.toUpperCase(),
          required: this.currentFieldValue.chkRequired
        }
      };
      this.dynamicFormModel.dyn_form_component.push(fieldFormatValue);
      this.currentFieldValue = Object.assign({}, this.currentFieldValue, { chkname : '', chkDisplay: false, chkRequired: false});
    } else if (this.currentSelectedFieldType === this.appConstValue.STR_RADIO) {
      // const optionsValues = this.currentFieldValue.rdoptions.split(',');
      // const optionsArray = optionsValues.map((item, idx) => {
      //   return {label: item, value : idx };
      // });
      fieldFormatValue = {
        key: this.currentFieldValue.rdname.toLowerCase().replace(/ /g, '_'),
        type: 'radio',
        isDisplay: this.currentFieldValue.rdDisplay,
        templateOptions: {
          type: 'radio',
          label: this.currentFieldValue.rdname.toUpperCase(),
          required: this.currentFieldValue.rdRequired,
          options: this.currentFieldValue.rdoptions
        }
      };
      this.dynamicFormModel.dyn_form_component.push(fieldFormatValue);
      this.currentFieldValue = Object.assign({}, this.currentFieldValue, { rdname : '', rdDisplay: false, rdRequired: false});
    }
    console.log(this.dynamicFormModel.dyn_form_component);
    this.modalService.dismissAll('Close popup after Save.');
    this.isSaveClick = false;

  }
  removeFieldRow(rowId) {
    this.dynamicFormModel.dyn_form_component.splice(rowId, 1);
  }

  addSelectRowOption() {
    this.currentFieldValue.seloptions.push({
      value: '',
      label: ''
    });
  }

  updateValueSelect(event, key, rowId) {
    this.currentFieldValue.seloptions[rowId][key] = event.target.value;
    this.currentFieldValue.seloptions = [...this.currentFieldValue.seloptions];
    console.log(this.currentFieldValue);
  }

  removeSelectRowOption(rowId) {
    this.currentFieldValue.seloptions.splice(rowId, 1);
  }

  addRadioRowOption() {
    this.currentFieldValue.rdoptions.push({
      value: '',
      label: ''
    });
  }

  updateValueRadio(event, key, rowId) {
    this.currentFieldValue.rdoptions[rowId][key] = event.target.value;
    this.currentFieldValue.rdoptions = [...this.currentFieldValue.rdoptions];
    console.log(this.currentFieldValue);
  }

  removeRadioRowOption(rowId) {
    this.currentFieldValue.rdoptions.splice(rowId, 1);
  }

  openTypeSelectionModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // console.log(this.closeResult);
    });
    return false;
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

  onSubmit(f: NgForm) {
    // console.log(this.dynamicFormModel);
    // sessionStorage.setItem('wineform', JSON.stringify(this.dynamicFormModel));
    if ( !!this.dynamicFormModel.category_type && !!this.dynamicFormModel.std_form_component.length) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      if (!this.isEdit) {
        this.saveDynamicForm();
      } else {
        const newModel = Object.assign({}, this.dynamicFormModel, {'id': this.dynamicFormId});
        this.updateDynamicForm(newModel);
      }
    }
  }

  saveDynamicForm() {
    this.dynamicFormService.saveDynamicForm(this.dynamicFormModel)
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
        this.appToastrService.showError(error.msg || 'Dynamic form detail failed to save.Please try again later.');
      });
  }

  updateDynamicForm(updateDynamicform) {
    this.dynamicFormService.updateDynamicForm(updateDynamicform)
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
      this.appToastrService.showError(error.msg || 'Dynamic form detail failed to update.Please try agian later.');
    });
  }
}
