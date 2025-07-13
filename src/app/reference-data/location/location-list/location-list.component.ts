import { Component, OnInit, ViewChild } from '@angular/core';
import { LocationService } from '../../location/location.service';
import { AppService } from '../../../shared/services/app.service';
import { AppToastrService } from '../../../shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from '../../../action/app-actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent implements OnInit {

  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['code', 'name.en']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  locations: any[];
  deleteRowId: '';
  @ViewChild('deleteSwalLocation', {static: true}) private deleteSwalLocation: SwalComponent;
  constructor(private store: Store<any>, private locationService: LocationService, private appService: AppService,
  private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.headers = [
      { key: 'country', cansort: true, label: 'Country', isShowCountryIcon: true },
      { key: 'code', cansort: true, label: 'Location Code' },
      { key: 'name', cansort: false, label: 'Name', subkey: 'en' },
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
    this.gridstate = curparams;

    this.locationService.getLocationsWithPageData(curparams, '', false)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.locations = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Location detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('/reference/reflocation/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalLocation.fire();
    }
  }


  deleteRecords() {
    this.locationService.deleteLocation({id: this.deleteRowId})
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
        this.appToastrService.showError( error.msg || 'Failed to delete location details.');
      });
  }

  onCloseDialog(event) {
    // console.log("Swal Dialog Closed");
  }

  createnew() {
    this.appService.gotoURL('/reference/reflocation/new');
  }

}
