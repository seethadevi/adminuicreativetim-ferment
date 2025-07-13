import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { WineryService } from '../../winery/winery.service';
import { AppService } from './../../../shared/services/app.service';
import { AppToastrService } from './../../../shared/services/app-toastr.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import * as appAction from './../../../action/app-actions';
import { Store } from '@ngrx/store';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { NavBarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-winery-list',
  templateUrl: './winery-list.component.html',
  styleUrls: ['./winery-list.component.scss']
})
export class WineryListComponent implements OnInit, AfterViewInit {

  defaultParams = {
    page: 1,
    limit: 9,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'address.city', 'region']
  };
  searchString = '';
  gridstate: any;
  totalRecords: number;
  totalPages: number;
  headers: any;
  actions: any;
  winerys: any[];
  deleteRowId: '';
  isShowTable: boolean;
  classList: any;
  defaultList: any;
  displayColumnList: any;
  @ViewChild('deleteSwalWinery', {static: true}) private deleteSwalWinery: SwalComponent;

  searchFilter: string;

  constructor(private wineryService: WineryService, private appService: AppService, private navService: NavBarService,
  private appToastrService: AppToastrService, private store: Store<any>) { }

  ngOnInit() {
    this.winerys = [];
    this.displayColumnList = {
      picture: 'picture',
      label: '',
      logo: '',
      name: 'name'
    };
    this.classList = ['producerImg', 'producerImageBox', 'wineryCard'];
    this.defaultList = [{ isIcon: true , iconValue : 'storefront'}];
    this.headers = [
      { key: 'name', cansort: true, label: 'Producer' },
      { key: 'address', cansort: false, label: 'Country', subkey: 'country' },
      { key: 'region', cansort: false, label: 'Region' },
    ];
    this.actions = { edit: true, delete: true };
    this.gridstate = this.defaultParams;
    this.reloadGrid(this.defaultParams);
    // this.reloadGrid_forDatatable(this.defaultParams);
    // this.navService.currentSearch.subscribe(message => this.searchFilter = message);
    // this.isShowTable = false;
  }

  ngAfterViewInit() {
    // this.navService.currentSearch.subscribe(message => {
    //   this.searchFilter = message;
    //   this.defaultParams.searchvalue = this.searchFilter;
    //   this.winerys = [];
    //   this.reloadGrid(this.defaultParams, this.winerys);
    // });
    //   this.navService.currentTableShow.subscribe(isTableShow => {
    //   this.isShowTable = isTableShow;
    // });
  }

  onSearchText() {
    this.gridstate.searchvalue = this.searchString;
    this.gridstate.page = 1;
    this.gridstate.pages = 1;
    this.reloadGridSearch(this.gridstate );
  }

  reloadGridSearch(curparams) {
    this.wineryService.getWinerysWithPageData(curparams)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const resDocs = response.res.docs;
            this.winerys = resDocs;
            this.totalRecords = response.res.total;
            this.totalPages = response.res.pages;
            this.gridstate['pages'] = response.res.pages;
            this.gridstate['total'] = response.res.total;
            // console.log('this.gridstate', this.gridstate);
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          this.appToastrService.showError( error.msg || 'Winery detail failed to get.');
        });
  }

  reloadGrid(curparams) {
    this.wineryService.getWinerysWithPageData(curparams)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            const resDocs = response.res.docs;
            this.winerys = this.winerys.concat(resDocs);
            this.totalRecords = response.res.total;
            this.totalPages = response.res.pages;
            this.gridstate['pages'] = response.res.pages;
            this.gridstate['total'] = response.res.total;
            // console.log('this.gridstate', this.gridstate);
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          this.appToastrService.showError( error.msg || 'Winery detail failed to get.');
        });
  }

  onReloadEvent(event) {
    if (event.action === 'nextPage' && this.gridstate.page < this.gridstate.pages) {
      this.gridstate.page = this.gridstate.page + 1;
      this.reloadGrid(this.gridstate);
    }
  }
  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('/reference/winery/update/' + event.item.id);
    } else if (event.action === 'delete') {
      this.deleteRowId = event.item.id;
      this.deleteSwalWinery.fire();
    }

  }

  deleteRecords() {
    this.wineryService.deleteWinery({id: this.deleteRowId})
    .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const indexPosition = this.winerys.findIndex((item) =>
            item.id === this.deleteRowId
          );
          this.winerys.splice(indexPosition, 1);
          this.appToastrService.showSuccess(response.msg);
        } else {
          this.appToastrService.showError(response.msg);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError( error.msg || 'Failed to delete winery details.');
      });
  }

  onCloseDialog(event) {
  }

  createnew() {
    this.appService.gotoURL('/reference/winery/new');
  }

}
