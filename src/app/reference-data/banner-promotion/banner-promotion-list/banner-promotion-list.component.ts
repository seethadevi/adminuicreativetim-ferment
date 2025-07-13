import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BannerPromotionService } from '../banner-promotion.service';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-banner-promotion-list',
  templateUrl: './banner-promotion-list.component.html',
  styleUrls: ['./banner-promotion-list.component.scss']
})
export class BannerPromotionListComponent implements OnInit {


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
  banners: any[];
  deleteRowId: '';
  isVisibleFlag = true;
  displayText  = 'Visible';
  constructor(private store: Store<any>, private bannerPromotionService: BannerPromotionService, private appService: AppService,
    private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.headers = [
    ];
    this.actions = { edit: false, delete: false };
    this.reloadGrid(this.defaultParams);
  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.banners, event.previousIndex, event.currentIndex);
    const bannerOrder = this.banners.map((banner, idx) => {
      return {
        id: banner._id,
        sortOrder: idx + 1
      };
    });

    this.updateSortOrder(bannerOrder);
  }

  reloadBannerList(event) {
    if (this.isVisibleFlag) {
      this.displayText = 'Visible';
    } else {
      this.displayText = 'All';
    }
    this.reloadGrid(this.gridstate);
  }
  reloadGrid(curparams) {
    this.gridstate = curparams;

    this.bannerPromotionService.getBannerPromotionsWithPageData(curparams , this.isVisibleFlag)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.banners = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Banners detail failed to get.');
        });
  }

  editBannerData(bannerId) {
    this.appService.gotoURL('/reference/bannerpromotion/update/' + bannerId);
  }


  updateSortOrder(bannerOrder) {
    this.bannerPromotionService.updateBannerPromotionOrder({ promotionOrder: bannerOrder })
      .subscribe(
        (response: any) => {
          // this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          if (response.status === 'success') {
            this.appToastrService.showSuccess(response.msg);
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
          this.appToastrService.showError(error.msg || 'Banner detail failed to update order.Please try agian later.');
      });
  }

}
