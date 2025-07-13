import { Component, OnInit, ViewChild } from '@angular/core';
import { VineyardService } from '../../vineyard/vineyard.service';
import { AppService } from '../../../shared/services/app.service';
import { AppToastrService } from '../../../shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from '../../../action/app-actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-vineyard-list',
  templateUrl: './vineyard-list.component.html',
  styleUrls: ['./vineyard-list.component.scss']
})
export class VineyardListComponent implements OnInit {

  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'address.city']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  vineyards: any[];
  deleteRowId: '';
  @ViewChild('deleteSwalVineyard', {static: true}) private deleteSwalVineyard: SwalComponent;
  constructor(private store: Store<any>, private vineyardService: VineyardService, private appService: AppService,
  private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.headers = [
      { key: 'name', cansort: true, label: 'Vineyard Name' },
      { key: 'address', cansort: false, label: 'Region', subkey: 'city' },
    ];
    this.actions = { edit: true, delete: true };
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

    this.vineyardService.getVineyardsWithPageData(curparams)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.vineyards = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        },
        error => {
          // console.log(error);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          this.appToastrService.showError( error.msg || 'Vineyard detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('/reference/vineyard/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalVineyard.fire();
    }
  }


  deleteRecords() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.vineyardService.deleteVineyard({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.reloadGrid(this.gridstate);
        } else {
          this.appToastrService.showError(response.msg);
        }
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Failed to delete vineyard details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('/reference//vineyard/new');
  }

}
