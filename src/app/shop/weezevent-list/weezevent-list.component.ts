import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { WeezeventService } from '../weezevent.service';
import * as appConst from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-weezevent-list',
  templateUrl: './weezevent-list.component.html',
  styleUrls: ['./weezevent-list.component.scss']
})
export class WeezeventListComponent implements OnInit, OnDestroy {

  eventSubscription: any;
  sub_id = '';
  weezeventList: any;
  totalRecords = 0;

  constructor(private appService: AppService, private store: Store<any>,
  private appToastrService: AppToastrService, private weezeventService: WeezeventService) { }

  ngOnInit() {
    this.weezeventList = [];
    this.eventSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.sub_id = s.appMainStore.subscriptionId;
        });

    this.getListofWeezevent();
  }

  ngOnDestroy() {
    if (!!this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  importEventDetails(event_id) {
    this.appService.gotoURL('subscriptionhome/shop/new/' + event_id);
    // this.weezeventService.getWeezEventDetails({ sub_id: this.sub_id , event_id: event_id})
    // .subscribe(
    //   (response: any) => {

    //   // if (!!response.events && !!response.events.length) {
    //   //   this.weezeventList = response.events;
    //   //   this.totalRecords = response.events.length;
    //   // } else {
    //   //   this.appToastrService.showError(response.msg);
    //   // }
    // },
    // error => {
    //   // console.log(error);
    //   this.appToastrService.showError(error.msg || 'Weezevent detail failed to get.');
    // });
  }


  getListofWeezevent() {
    this.weezeventService.getWeezeventList({ sub_id: this.sub_id })
    .subscribe(
      (response: any) => {
      if (!!response.events && !!response.events.length) {
        this.weezeventList = response.events;
        this.totalRecords = response.events.length;
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Weezevent detail failed to get.');
    });
  }

}
