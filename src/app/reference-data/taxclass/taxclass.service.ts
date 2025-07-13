import { Injectable } from '@angular/core';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';
import { Observable } from 'rxjs';
import { AppService } from './../../shared/services/app.service';

@Injectable()
export class TaxclassService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

// HTTP Call for Save Taxclass
saveTaxclass(req): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.post(this.urls.api['taxclass'], req);
}

// HTTP Call for Update Taxclass
updateTaxclass(req): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.put(this.urls.api['taxclass'] + '/' + req.id, req);
}

// HTTP Call for Get Taxclass
getTaxclass(req): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.get(this.urls.api['taxclass'] + '/' + req.id);
}

// HTTP Call for Get Taxclass
deleteTaxclass(req): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.delete(this.urls.api['taxclass'] + '/' + req.id);
}

// HTTP Call for getTaxclassList
getTaxclassList(): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.post(this.urls.api['taxclass'] + '/default',  {});
}

getSubscriptionTaxclass(req): Observable<any> {
  return this.communicationService.get(this.urls.api['taxclass'] + '/subscription/' + req.sub_id);
}

getTaxclasssWithPageData(params) {
  const defaults = {
    page: 1,
    limit: 10,
    sortkey: '',
    sortorderstring: 'desc',
    search: '',
    sort: ''
  };

  const query = Object.assign({}, defaults, params);

  const url = this.urls.api['taxclass'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
  if (query.sortorderstring === 'desc') {
    query['sort'] = -1;
  }

  if (query.searchvalue.length > 1 && !!query.searchelems.length) {
    const search = [];
    query.searchelems.map((item) => {
      search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
    });
    query['search'] = { '$or':  search };
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
