import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { EmployeeService } from '../employee.service';
import * as appConst from 'src/app/shared/structures/app-constant';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  defaultParams = {
    page: 1,
    limit: 100,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['username', 'firstname', 'lastname', 'email', 'mobile']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  employees: any[];
  deleteRowId: '';
  classList: any;
  defaultList: any;
  employeeSubscription: any;
  sub_id = '';
  displayColumnList: any;
  @ViewChild('deleteSwalEmployee', {static: false}) private deleteSwalEmployee: SwalComponent;
  constructor(private appService: AppService, private store: Store<any>,
    private appToastrService: AppToastrService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.headers = [
      { key: 'username', cansort: true, label: 'User Name' },
      { key: 'firstname', cansort: true, label: 'Firts & Last Name', appendColumn: 'lastname'},
      { key: 'email', cansort: true, label: 'Email'},
      { key: 'mobile', cansort: true, label: 'Mobile' }
    ];
    this.displayColumnList = {
      picture: 'picture',
      label: '',
      logo: '',
      name: 'firstname'
    };
    this.actions = { edit: true, delete: false };
    this.classList = ['prodImg', '' , 'vendorCard'];
    this.defaultList = [{ isIcon: true , iconValue : 'assignment_ind'}];
    this.employeeSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
    });
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.reloadGrid(this.defaultParams);
  }

  ngOnDestroy() {
    if (!!this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  reloadGrid(curparams) {
    this.gridstate = curparams;
    this.employeeService.getEmployeesWithPageData(curparams, this.sub_id)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          const employees = response.res.docs;
          this.employees = employees.map((employee) => {
            const emp = employee;
            emp['name'] = employee['firstname'] + ' ' + employee['lastname'];
            return emp;
          });
          this.totalRecords = response.res.total;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Employee detail failed to get.');
      });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('subscriptionhome/employee/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalEmployee.fire();
    }
  }

  editEmployee(empId) {
    this.appService.gotoURL('subscriptionhome/employee/update/' + empId);
  }

  deleteEmployee(empId) {
    this.deleteRowId = empId;
    this.deleteSwalEmployee.fire();
  }

  deleteRecords() {
    this.employeeService.deleteEmployee({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.reloadGrid(this.gridstate);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        console.log(error);
        this.appToastrService.showError( error.msg || 'Failed to delete employee details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('subscriptionhome/employee/new');
  }

}
