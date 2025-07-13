import { Injectable } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Urls } from 'src/app/shared/structures/urls';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {

constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

 // HTTP Call for Get Winery
 getApprovalItem(req): Observable<any> {
  // console.log('payload before service call', req);
  return this.communicationService.get(this.urls.api['approve'] + '/' + req.id);
 }

  // HTTP Call for Update Product
  updateApprovalStatus(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['approve'] + '/status/' + req.id, req);
  }

  // HTTP Call for Get Wine
    getApprovalsWithPageData(params) {
      const defaults = {
        page: 1,
        limit: 10,
        sortkey: '',
        sortorderstring: 'desc',
        search: '',
        sort: ''
      };

      let query ;

      const url = this.urls.api['approve'] + '/search';
      if (typeof(params) === 'string') {
        query = Object.assign({}, query, {search : { '$or': [ {'name' : {'$regex': '.*' + params + '.*', '$options' : 'i'} }] }});
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

      query['search'] = Object.assign({}, query.search, {
        '$and': [
          {
            'status': 'WAITING_LIST'
          }
        ]
      });

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
