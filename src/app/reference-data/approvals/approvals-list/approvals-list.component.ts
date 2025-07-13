import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as appConst from 'src/app/shared/structures/app-constant';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Store } from '@ngrx/store';
import { ApprovalsService } from '../approvals.service';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import * as appAction from 'src/app/action/app-actions';


@Component({
  selector: 'app-approvals-list',
  templateUrl: './approvals-list.component.html',
  styleUrls: ['./approvals-list.component.scss']
})
export class ApprovalsListComponent implements OnInit , OnDestroy {

  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'description', 'sub_name', 'region']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  requestList: any[];
  deleteRowId: '';
  reqsSubscription: any;
  selectedRowId = '';
  selectedRowData = {};
  @ViewChild('deleteSwalBox', { static: true }) private deleteSwalBox: SwalComponent;
  @ViewChild('approveSwalBox', { static: true }) private approveSwalBox: SwalComponent;
  constructor(private store: Store<any>, private approvalsService: ApprovalsService, private appService: AppService,
  private appToastrService: AppToastrService) { }

  ngOnInit(): void {
      this.headers = [
        { key: 'sub_name', cansort: true, label: 'Subscription'},
        { key: 'name', cansort: true, label: 'Name' },
        { key: 'type', cansort: true, label: 'Type' },
        { key: 'createddate', cansort: true, label: 'Requested On', type: 'datetime' }
      ];
    this.actions = { edit: false, delete: false, reject: true, approve: true , detail: true};
    this.reloadGrid(this.defaultParams);
  }

  ngOnDestroy() {
  }

  onOperation(event) {
    this.selectedRowId = event.item.id;
    this.selectedRowData = Object.assign({}, event.item , {status: ''});
    if (event.action === 'approve') {
      this.selectedRowData['status'] = 'APPROVED';
      this.approveSwalBox.fire();
    } else if (event.action === 'reject') {
      this.selectedRowData['status'] = 'REJECTED';
      this.deleteSwalBox.fire();
    } else if (event.action === 'detail') {
      if (event.item.type === 'PRODUCT') {
        this.appService.gotoURL('/reference/approvals/detailproduct/' + this.selectedRowId);
      } else if (event.item.type === 'PRODUCER') {
        this.appService.gotoURL('/reference/approvals/detailproducer/' + this.selectedRowId);
      }
    }
  }

  RejectRecords() {
    this.selectedRowData['status'] = 'REJECTED';
    this.updateRequestChange();
  }

  ApproveRecords() {
    this.selectedRowData['status'] = 'APPROVED';
    this.updateRequestChange();
  }

  onCloseDialog(event) {
  }

  updateRequestChange() {
    if (this.selectedRowData['type'] === 'PRODUCER') {
      if (this.selectedRowData['producer_id'] !== undefined && !!this.selectedRowData['producer_id']
        && this.selectedRowData['producer_id'] !== '') {
        this.selectedRowData = Object.assign({}, this.selectedRowData , {status: 'APPROVED',  'id': this.selectedRowId, action: 'UPDATE'});
      } else {
        this.selectedRowData = Object.assign({}, this.selectedRowData , {status: 'APPROVED',  'id': this.selectedRowId, action: 'ADD'});
      }
    } else if (this.selectedRowData['type'] === 'PRODUCT') {
      if (this.selectedRowData['product_id'] !== undefined && !!this.selectedRowData['product_id']
        && this.selectedRowData['product_id'] !== '') {
        this.selectedRowData = Object.assign({}, this.selectedRowData, {
          status: 'APPROVED',
          'id': this.selectedRowId, action: 'UPDATE'
        });
      } else {
        this.selectedRowData = Object.assign({}, this.selectedRowData , {status: 'APPROVED',  'id': this.selectedRowId, action: 'ADD'});
      }
    }
    this.updateStatus(this.selectedRowData);
  }

  updateStatus(postParam) {
    // console.log(postParam);
    this.approvalsService.updateApprovalStatus(postParam)
      .subscribe(
      (response: any) => {
         if (response.status === 'success') {
           this.appToastrService.showSuccess(response.msg);
           this.reloadGrid(this.gridstate);
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

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  reloadGrid(curparams) {
    this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: true } });
    this.gridstate = curparams;

    this.approvalsService.getApprovalsWithPageData(curparams)
      .subscribe(
        (response: any) => {
          this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: false } });
          if (response.status === 'success') {
            this.requestList = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          if (typeof (error.msg) === 'object') {
          } else {
            this.appToastrService.showError( error.msg || 'Customers detail failed to get.');
          }
        });
 }
}
