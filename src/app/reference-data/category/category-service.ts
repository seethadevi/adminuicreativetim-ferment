import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Category
  saveCategory(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['category'], req);
  }

  // HTTP Call for Update Category
  updateCategory(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['category'] + '/' + req.id, req);
  }

  // HTTP Call for Get Category
  getCategory(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['category'] + '/' + req.id);
  }

  // HTTP Call for Get Category
  deleteCategory(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['category'] + '/' + req.id);
  }

  getCategorysWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: {},
      sort: ''
    };

    const query = Object.assign({}, defaults, params);

    const url = this.urls.api['category'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }
    if (query.searchvalue.length > 1 && !!query.searchelems && query.searchelems.length >= 1) {
      const search = {};
      query.searchelems.map((item) => {
        search[item] = { '$regex': '.*' + query.searchvalue + '.*', '$options': 'i' };
      });
      query['search'] = search;
    }

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);

  }
}
