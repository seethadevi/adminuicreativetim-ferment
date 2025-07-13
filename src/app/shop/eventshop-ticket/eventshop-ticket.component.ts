import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ShopTariffService } from '../shop-tariff.service';
import { AppService } from 'src/app/shared/services/app.service';

@Component({
  selector: 'app-eventshop-ticket',
  templateUrl: './eventshop-ticket.component.html',
  styleUrls: ['./eventshop-ticket.component.scss']
})
export class EventshopTicketComponent implements OnInit, OnDestroy {


  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['email', 'first_name', 'last_name']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;
  eventTickets: any[];
  deleteRowId: '';
  shopSubscription: any;
  sub_id = '';
  shopId = '';
  constructor(private store: Store<any>, private shopTariffService: ShopTariffService, private appService: AppService,
    private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.shopSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.sub_id = s.appMainStore.subscriptionId;
      this.shopId = s.appMainStore.shopId;
    });
    this.headers = [
      { key: 'first_name', cansort: true, label: 'Name', appendColumn: 'last_name' },
      { key: 'email', cansort: true, label: 'Email'},
      { key: 'cusTotalTicketCount', cansort: false, label: 'Ticket Count' },
      { key: 'cusTotalTicketAmount', cansort: false, label: 'Ticket Amount' },
      { key: 'createddate', cansort: true, label: 'Purchased On', type: 'datetime' }
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
  reloadGrid(curparams) {
    this.gridstate = curparams;
    const param = Object.assign({}, curparams, {sub_id: this.sub_id, shop_id: this.shopId});

    this.shopTariffService.getEventTicketWithPageData(param)
      .subscribe(
        (response: any) => {
          // if (response.status === 'success') {
            // this.eventTickets = response.res.docs;
            const ticketData = response.res.docs;
          this.eventTickets = ticketData.map((ticket, index) => {
            const newTicket = ticket;
            let totalCount = 0;
            let totalAmt = 0;
            ticket['transactions'].map((trans) => {
              totalCount += trans.cnt;
              totalAmt += trans.tot_amt_vat;
            });
            newTicket['cusTotalTicketCount'] = totalCount;
            newTicket['cusTotalTicketAmount'] = totalAmt;
            return newTicket;
          });
            this.totalRecords = response.res.total;
          // } else {
            // this.appToastrService.showError(response.msg);
          // }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Event tickets detail failed to get.');
        });
  }

  onOperation(event) {
  }

  ngOnDestroy() {
    if (!!this.shopSubscription) {
      this.shopSubscription.unsubscribe();
    }
  }


}
