import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Urls } from 'src/app/shared/structures/urls';
import { AppService } from 'src/app/shared/services/app.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  constructor(private urls: Urls, private communicationService: CommunicationService, private appService: AppService) { }


  // HTTP Call for Save HtmlTemplate
  saveHtmlTemplate(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['htmlTemplate'], req);
  }

  // HTTP Call for Update HtmlTemplate
  updateHtmlTemplate(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['htmlTemplate'] + '/' + req.id, req);
  }

  // HTTP Call for Get HtmlTemplate
  getHtmlTemplate(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['htmlTemplate'] + '/' + req.id);
  }

  // HTTP Call for Get HtmlTemplate
  deleteHtmlTemplate(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['htmlTemplate'] + '/' + req.id);
  }

  getHtmlTemplatesWithPageData(params) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    const  query = Object.assign({}, defaults, params);
    const url = this.urls.api['htmlTemplate'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
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

    query['search'] = Object.assign({}, query.search, { sub_id: { $in: [null] } });


    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }
}
