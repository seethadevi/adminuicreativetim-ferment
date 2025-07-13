import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from '../../shared/services/app.service';
import { AppToastrService } from '../../shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from '../../action/app-actions';
import { Store } from '@ngrx/store';
import { NotificationService } from '../notification.service';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy {
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['notify_name', 'notify_medium', 'content_type', 'notify_status']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  notifications: any[];
  deleteRowId: '';
  notificationSubscription: any;
  sub_id = '';
  @ViewChild('deleteSwalNotification', {static: true}) private deleteSwalNotification: SwalComponent;
  constructor(private store: Store<any>, private notificationService: NotificationService, private appService: AppService,
    private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.notificationSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
    });
    this.headers = [
      { key: 'notify_name', cansort: true, label: 'Name'},
      { key: 'notify_medium', cansort: true, label: 'Medium' },
      { key: 'content_type', cansort: false, label: 'Type'},
      { key: 'notify_status', cansort: false, label: 'Status' }
    ];
    this.actions = { edit: true, delete: false };
    this.reloadGrid(this.defaultParams);
  }

  ngOnDestroy() {
    if (!!this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
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

    this.notificationService.getNotificationsWithPageData(curparams, this.sub_id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.notifications = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Notification detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('/subscriptionhome/notification/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalNotification.fire();
    }
  }


  deleteRecords() {
    this.notificationService.deleteNotification({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.appToastrService.showSuccess(response.msg);
          this.reloadGrid(this.gridstate);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Failed to delete Notification details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('/subscriptionhome/notification/new');
  }
}
