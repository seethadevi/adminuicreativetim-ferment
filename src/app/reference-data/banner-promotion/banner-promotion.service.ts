import { Injectable } from '@angular/core';
import { Urls } from 'src/app/shared/structures/urls';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerPromotionService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save BannerPromotion
  saveBannerPromotion(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['bannerPromation'], req);
  }

  // HTTP Call for Update BannerPromotion
  updateBannerPromotionOrder(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['bannerPromation'] + '/updateSortOrder' , req);
  }

  // HTTP Call for Update BannerPromotion
  updateBannerPromotion(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['bannerPromation'] + '/' + req.id, req);
  }

  // HTTP Call for Get BannerPromotion
  getBannerPromotion(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['bannerPromation'] + '/' + req.id);
  }

  // HTTP Call for delete BannerPromotion
  deleteBannerPromotion(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['bannerPromation'] + '/' + req.id);
  }
  getBannerPromotionsWithPageData(params, isVisibleFlag) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: '',
      searchvalue: ''
    };
    let query;
    const url = this.urls.api['bannerPromation'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (typeof(params) === 'string') {
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});
      query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.' + params + '.', '$options' : 'i'} }] }});
    } else {
      query = Object.assign({}, defaults, params);

      if (query.sortorderstring === 'desc') {
        query['sort'] = -1;
      }

      if (query.searchvalue.length > 1 && !!query.searchelems.length) {
        const search = [];
        query.searchelems.map((item) => {
          // searchJSON = '{' + item + ':' +  '{' + '$regex:' + '.*' + query.searchvalue + '.*,' + '$options:' + 'i' + '}' + '}');
          search.push(this.appService.helperFunction(item, ['$regex', '$options'], query.searchvalue));
        });
        // console.log(search);
        query['search'] = { '$or':  search };
      }
    }

    if (isVisibleFlag) {
      query['search'] = Object.assign({}, query.search, {'$and' : [{ 'isVisible' : { '$eq' : true } }] });
    }

    const param = {
      page: !!query.page ? query.page : 1,
      limit: !!query.limit ? query.limit : 10,
      sort: !!query.sort ? query.sort : 1,
      search: query.search
    };

    if (typeof(params) === 'string') {
      return this.communicationService.postSearch(url, param);
    } else {
      return this.communicationService.post(url, param);
    }
  }
}
