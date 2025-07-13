import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from './../../shared/structures/urls';
import { CommunicationService } from './../../shared/services/communication.service';
import { AppService } from './../../shared/services/app.service';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }

  // HTTP Call for Save Location
  saveLocation(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['location'], req);
  }

  // HTTP Call for Update Location
  updateLocation(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['location'] + '/' + req.id, req);
  }

  // HTTP Call for Get Location
  getLocation(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['location'] + '/' + req.id);
  }

  getListOfLocationCode(searchTxt, country): Observable<any> {
    return this.communicationService.getSearch(this.urls.api['reference'] + '/locationSearch?country=' + country + '&q=' + searchTxt);
  }
  // HTTP Call for delete Location
  deleteLocation(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['location'] + '/' + req.id);
  }
  getLocationsWithPageData(params, country, displayOption) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: {'sortOrder': -1, 'name': 1},
      searchvalue: ''
    };
    let query;
    const url = this.urls.api['location'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (typeof(params) === 'string') {
      // query = Object.assign({}, defaults, {search : JSON.stringify({'name' : { '$regex': '.*' + params + '.*', '$options': 'i' }})});
      query = Object.assign({}, query, {
        search: {
          '$and': [
            {'code': { '$regex': '.*' + params + '*.', '$options': 'i' } },
            { 'country': { '$eq' : country } }
          ]
        }
      });
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
    if (displayOption === true) {
      query['search'] = Object.assign({}, query.search, { isAvailable:  displayOption});
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
