import { Injectable } from '@angular/core';
import { Urls } from '../shared/structures/urls';
import { CommunicationService } from '../shared/services/communication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private urls: Urls, private communicationService: CommunicationService) { }

  // HTTP Call for Save Employee
  saveEmployee(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.post(this.urls.api['employee'], req);
  }

  // HTTP Call for Update Employee
  updateEmployee(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['employee'] + '/' + req.id, req);
  }

  // HTTP Call for Update Employee
  updateEmployeePwd(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.put(this.urls.api['employee'] + '/' + req.id + '/password', req);
  }

  // HTTP Call for Get Employee
  getEmployee(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.get(this.urls.api['employee'] + '/' + req.id);
  }

  // HTTP Call for Get Employee
  deleteEmployee(req): Observable<any> {
    // console.log('payload before service call', req);
    return this.communicationService.delete(this.urls.api['employee'] + '/' + req.id);
  }

  getEmployeesWithPageData(params, sub_id) {

    const defaults = {
      page: 1,
      limit: 10,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };

    let query = Object.assign({}, defaults, params);

    const url = this.urls.api['employee'] + '/search'; // + "?page=" + query.page + "&limit=" + query.limit
    if (query.sortorderstring === 'desc') {
      query['sort'] = -1;
    }

    query = Object.assign({}, query, {search : {sub_id: sub_id}});

    const param = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      search: query.search
    };

    return this.communicationService.post(url, param);
  }
}
