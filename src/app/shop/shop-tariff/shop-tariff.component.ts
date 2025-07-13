import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/services/app.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ShopTariffService } from '../shop-tariff.service';
import * as appAction from 'src/app/action/app-actions';
import * as appConst from 'src/app/shared/structures/app-constant';
@Component({
  selector: 'app-shop-tariff',
  templateUrl: './shop-tariff.component.html',
  styleUrls: ['./shop-tariff.component.scss']
})
export class ShopTariffComponent implements OnInit {

  title = 'Add';
  tickets: any[];
  ticketsType: any[];
  ticketObject: any;
  isTicketUpdate = false;
  defaultTicketValue = {
    id: '',
    type: '',
    name: '',
    price: 0,
    price_vat: 0,
    vat: 0,
    vat_unit: '%',
    participants: 0,
    limit: 0,
    max: 0,
    start_date: null,
    end_date: null,
    sort_order: ''
  };
  ticket_group_name = '';
  groupNames: any[];
  numbers: any[];
  shopId = '';
  shopSubscription: any;
  sub_id: '';
  isEdit = false;
  create_new_group = false;
  constructor(public appService: AppService, private store: Store<any>, private route: ActivatedRoute,
    private appToastrService: AppToastrService, private shopTariffService: ShopTariffService) {
}

  ngOnInit() {
    this.ticketObject = Object.assign({}, {} , this.defaultTicketValue);
    this.groupNames = [];
    this.tickets = [];
    this.numbers = Array(16).fill(1, 0, 16).map((x, i) => i); // [0,1,2,3,4]
    this.ticketsType = [{ id: '', name: 'Select Type' },
      { id: 'TICKET', name: 'Ticket' },
      { id: 'GROUP', name: 'Group' }];
      this.shopSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.sub_id = s.appMainStore.subscriptionId;
      });
    if (this.route.snapshot.params['id']) {
      this.shopId = this.route.snapshot.params['id'];
      this.getTariffData();
    }
  }

  getTariffData() {
    this.shopTariffService.getTariff(this.shopId)
    .subscribe(
      (response: any) => {
      if (response.status === 'success') {
        this.tickets = response.msg;
        if (!!this.tickets.length) {
          this.isEdit = true;
          this.title = 'Update';
        }
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Shop Tariff detail failed to get.Please try agian later.');
    });
  }

  generateTicketID = () => {
    return this._p8(false) + this._p8(true);
  }

  _p8(s) {
    const p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '' + p.substr(0, 4) + '' + p.substr(4, 4) : p ;
  }

  saveTicketToEvent(event) {
    if (!this.ticketObject.type || !this.ticketObject.name || this.ticketObject.limit <= 0) {
      return false;
    }

    if (this.ticketObject.type === 'GROUP' &&   !this.ticket_group_name) {
      return false;
    }

    if (this.ticketObject.type === 'TICKET') {
      const create_ticket = this.ticketObject;
      create_ticket['id'] = this.generateTicketID();
      create_ticket['sort_order'] = this.tickets.length + 1;
      this.tickets.push(create_ticket);
      // console.log(create_ticket);
    } else if (this.ticketObject.type === 'GROUP') {
      let group_ticket = {};
      const groupIdx = this.tickets.findIndex(x => x['id'] === this.ticket_group_name);
      group_ticket = {
          id : this.generateTicketID(),
          name :  this.ticket_group_name,
          sort_order :  this.tickets.length + 1,
          ticket_arr: [],
          type: 'GROUP'
      };
      const create_ticket = this.ticketObject;
      create_ticket['id'] = this.generateTicketID();
      create_ticket['type'] = 'TICKET';
      if (groupIdx === -1) {
        create_ticket['sort_order'] = 1;
        group_ticket['ticket_arr'].push(create_ticket);
        this.tickets.push(group_ticket);
      } else {
        create_ticket['sort_order'] = this.tickets[groupIdx]['ticket_arr'].length + 1;
        this.tickets[groupIdx]['ticket_arr'].push(create_ticket);
      }
      // if (this.groupNames.length === 0) {
      //   group_ticket = {
      //     id : this.generateTicketID(),
      //     name :  this.ticket_group_name,
      //     sort_order :  this.tickets.length + 1,
      //     ticket_arr: [],
      //     type: 'GROUP'
      //   };
      //   const create_ticket = this.ticketObject;
      //   create_ticket['id'] = this.generateTicketID();
      //   create_ticket['sort_order'] =  1;
      //   create_ticket['type'] =  'TICKET';
      //   group_ticket['ticket_arr'].push(create_ticket);
      //   this.tickets.push(group_ticket);
      // } else {
      //   const groupIdx = this.tickets.findIndex(x => x['id'] === this.ticket_group_name );
      //   const create_ticket = this.ticketObject;
      //   create_ticket['id'] = this.generateTicketID();
      //   create_ticket['sort_order'] =  this.tickets[groupIdx]['ticket_arr'].length + 1;
      //   create_ticket['type'] =  'TICKET';
      //   this.tickets[groupIdx]['ticket_arr'].push(create_ticket);
      // }
    }
    this.ticketObject = Object.assign({}, {} , this.defaultTicketValue);
    this.ticket_group_name = '';
    event.preventDefault();
    return false;
  }

  updateTicketToEvent(event) {
    if (!this.ticketObject.type || !this.ticketObject.name || this.ticketObject.limit <= 0) {
      return false;
    }

    if (this.ticketObject.type === 'GROUP' &&   !this.ticket_group_name) {
      return false;
    }

    if (this.ticketObject.type === 'TICKET') {
      const ticketIdx = this.tickets.findIndex(x => x['id'] === this.ticketObject['id']);
      if (ticketIdx !== -1) {
        this.tickets[ticketIdx] = this.ticketObject;
      }
    } else if (this.ticketObject.type === 'GROUP') {
      const groupIdx = this.tickets.findIndex(x => x['id'] === this.ticket_group_name);
      const ticketIdx = this.tickets[groupIdx]['ticket_arr'].findIndex(x => x['id'] === this.ticketObject['id']);
      const create_ticket = this.ticketObject;
      create_ticket['type'] = 'TICKET';
      this.tickets[groupIdx]['ticket_arr'][ticketIdx] = create_ticket;
    }

    this.ticketObject = Object.assign({}, {} , this.defaultTicketValue);
    this.ticket_group_name = '';
    event.preventDefault();
    return false;
  }
  checkSavedGroup(event) {
    if (this.ticketObject.type === 'GROUP' && !!this.tickets && !!this.tickets.length) {
      const list_of_name = [];
      for (let idx = 0; idx < this.tickets.length; idx++) {
        if ( this.tickets[idx]['type'] === 'GROUP') {
          const data = {
            name: this.tickets[idx]['name'],
            id: this.tickets[idx]['id'],
          };
          list_of_name.push(data);
        }
      }
      if (list_of_name.length > 0) {
        this.groupNames = list_of_name;
      }
    }
  }

  deleteTicket(ticket, index) {
    this.tickets.splice(index, 1);
  }

  deleteGroupTicket(ticket, index, group_idx) {
    this.tickets[index]['ticket_arr'].splice(group_idx, 1);
  }

  editTicket(ticket, index) {
    this.ticketObject = Object.assign({}, {}, this.tickets[index]);
    this.isTicketUpdate = true;
  }

  editGroupTicket(ticket, group_idx, index) {
    this.ticketObject = Object.assign({}, {}, this.tickets[group_idx]['ticket_arr'][index]);
    this.ticketObject['type'] = 'GROUP';
    this.ticket_group_name = this.tickets[group_idx]['id'];
    this.isTicketUpdate = true;
    this.checkSavedGroup('');
    this.create_new_group = false;
  }

  calculateTotalPrice(event: any) {
    if (!isNaN(this.ticketObject.price) && this.ticketObject.price  !== ''
        && !isNaN(this.ticketObject.vat) && this.ticketObject.vat  !== '') {
      const price = !!this.ticketObject.price ? this.ticketObject.price : 0;
      const vat = !!this.ticketObject.vat ? this.ticketObject.vat : 0;
      this.ticketObject.price_vat = (price + ((price * vat) / 100 )).toFixed(2);
    }
  }

  onSaveClick() {

    if (this.isEdit) {
      this.updateTariff();
    } else {
      if (!!this.tickets && !!this.tickets.length) {
        this.saveTariff();
      }
    }
  }

  createNewGroup() {
    this.create_new_group = !this.create_new_group;
    this.ticket_group_name = '';
  }

  saveTariff() {
    this.shopTariffService.saveTariff({ 'tickets' : this.tickets }, this.shopId)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
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
        this.appToastrService.showError(error.msg || 'Event tariff failed to save.Please try again later.');
      });
  }

  updateTariff() {
    this.shopTariffService.updateTariff({ tickets: this.tickets }, this.shopId)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
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
        this.appToastrService.showError(error.msg || 'Event tariff failed to save.Please try again later.');
      });
  }

  onClearValue() {
    this.appService.gotoURL('subscriptionhome/shop');
  }

}
