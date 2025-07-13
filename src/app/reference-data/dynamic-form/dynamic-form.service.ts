import { Injectable } from '@angular/core';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {
  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save DynamicForm
  saveDynamicForm(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['dynamicForm'], req);
  }

  // HTTP Call for Update DynamicForm
  updateDynamicForm(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['dynamicForm'] + '/' + req.id, req);
  }

  // HTTP Call for Get DynamicForm
  getDynamicForm(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['dynamicForm'] + '/' + req.id);
  }

  getFormWithCategory(req): Observable<any> {
    return this.communicationService.get(this.urls.api['dynamicForm'] + '/category/' + req);
  }

  // HTTP Call for Get DynamicForm
  deleteDynamicForm(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['dynamicForm'] + '/' + req.id);
  }

  getDynamicFormsWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['dynamicForm'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : ''});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }
}
