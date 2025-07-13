import { Injectable } from '@angular/core';
import { CommunicationService } from '../shared/services/communication.service';
import { Urls } from '../shared/structures/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Channel
  saveChannel(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['channel'], req);
  }

  // HTTP Call for Save Channel
  saveCustomerApproveStatus(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['channel'] + '/customer/add/' + req.channel_request_id, req);
  }

  // HTTP Call for Update Channel
  updateChannel(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['channel'] + '/' + req.id, req);
  }

  // HTTP Call for Get Channel
  getChannel(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['channel'] + '/' + req.id);
  }

  getSubChannel(req): Observable<any> {
    return this.communicationService.post(this.urls.api['channel'] + '/subscription/' + req.id, {});
  }

  // HTTP Call for Get Channel
  deleteChannel(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['channel'] + '/' + req.id);
  }

  getChannelsWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['channel'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {sub_id: sub_id}});
    // query = Object.assign({}, query, {search : ''});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);

  }

  getCustomerPageData(params, sub_id, channel_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['channel'] + '/customer/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {sub_id: sub_id}});
    // query = Object.assign({}, query, {search : ''});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search,
      channel_id: channel_id
    };

    return this.communicationService.post(url, param);

  }

  getRequestPageData(params, sub_id, channelId) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['channel'] + '/request/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {
      search: {
        '$and': [
          { 'sub_id': { '$eq': sub_id } },
          { 'channel_id': { '$eq': channelId } }
        ]
      }
    });

    // '$and': [
    //   {'code': { '$regex': '.*' + params + '*.', '$options': 'i' } },
    //   { 'country': { '$eq' : country } }
    // ]
    // query = Object.assign({}, query, {search : ''});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);

  }
}
