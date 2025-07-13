import { Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { DynamicFormService } from '../dynamic-form.service';
import { AppService } from './../../../shared/services/app.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import * as appAction from './../../../action/app-actions';

@Component({
  selector: 'app-dynamic-form-list',
  templateUrl: './dynamic-form-list.component.html',
  styleUrls: ['./dynamic-form-list.component.scss']
})
export class DynamicFormListComponent implements OnInit {
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['category_type', 'displayName', 'region.name', 'winery.name']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  dynamicForms = [];
  deleteRowId = '';
  @ViewChild('deleteSwalForm', {static: true}) private deleteSwalWine: SwalComponent;
  constructor(private dynamicFormService: DynamicFormService, private appService: AppService, private store: Store<any>,
    private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.headers = [
      { key: 'category_type', cansort: true, label: 'Category' },
      { key: 'std_form_component', cansort: false, label: 'standard Field Cnt', showLength: true },
      { key: 'dyn_form_component', cansort: false, label: 'Dynamic Field Cnt', showLength: true },
    ];
    this.actions = { edit: true, delete: false };
    this.reloadGrid(this.defaultParams);
  }


  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  reloadGrid(curparams) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.gridstate = curparams;

    this.dynamicFormService.getDynamicFormsWithPageData(curparams)
      .subscribe(
        (response: any) => {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === 'success') {
            this.dynamicForms = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          this.appToastrService.showError( error.msg || 'Dynamic form detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('reference/dynamicform/update/' + event.item.id);
    } else if (event.action === 'delete') {
       this.deleteRowId = event.item.id;
       this.deleteSwalWine.fire();
    }
  }

  deleteRecords() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.dynamicFormService.deleteDynamicForm({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.reloadGrid(this.gridstate);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Failed to delete dynamic form details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('reference/dynamicform/new');
  }

}
