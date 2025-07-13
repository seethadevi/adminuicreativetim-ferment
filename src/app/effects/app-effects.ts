import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';

import { AppService } from '../shared/services/app.service';
import * as appAction from '../action/app-actions';

@Injectable()
export class AppEffects {
    constructor(private action: Actions, private store: Store<any>, private appService: AppService,
        private actions$: Actions) { }

        @Effect()
        userLogin: Observable<Action> = this.actions$.pipe(
          ofType(appAction.USER_LOGIN),
          switchMap( (actionObject) =>
              this.appService.userLogin(actionObject['payload']).pipe(
                map((resp) => {
                    if (resp.status === 'error') {
                        return new appAction.UserLoginFailed({ message: resp.msg, status: resp.status });
                    } else {
                        return new appAction.UserLoginSuccess(resp);
                    }
                }),
                catchError((err) => of({ type: appAction.USER_LOGIN_FAILED, payload: err }))
              )
          )
        );
        @Effect()
        selectSubsciption: Observable<Action> = this.actions$.pipe(
          ofType(appAction.SELECT_SUBSCRIPTION),
          switchMap( (actionObject) =>
              this.appService.getWarehouse(actionObject['payload']).pipe(
                map((resp) => {
                    if (resp.status === 'error') {
                        return new appAction.SelectSubscriptionFailed({ message: resp.msg, status: resp.status });
                    } else {
                        if (!!resp['res']['docs'].length) {
                            const data = {'id' : resp['res']['docs'][0]['_id'],
                            'name':  resp['res']['docs'][0]['name']};
                            return new appAction.SelectSubscriptionSuccess(data);
                        } else {
                            return new appAction.SelectSubscriptionFailed({ message: resp.msg, status: resp.status });
                        }
                    }
                }),
                catchError((err) => of({ type: appAction.SELECT_SUBSCRIPTION_FAILED, payload: err }))
              )
          )
        );

        @Effect()
        getCountryList: Observable<Action> = this.actions$.pipe(
          ofType(appAction.GET_COUNTRY_LIST),
          switchMap( (actionObject) =>
              this.appService.loadCountryList(actionObject['payload']).pipe(
                map((resp) => {
                    if (resp.status === 'error') {
                        return new appAction.GetCountryListFailed({ status: 'Failed'});
                    } else {
                        return new appAction.GetCountryListSuccess(resp.contryList);
                    }
                }),
                catchError((err) => of({ type: appAction.GET_COUNTRY_LIST_FAILED, payload: err }))
              )
          )
        );

        @Effect()
        getEventCountryList: Observable<Action> = this.actions$.pipe(
        ofType(appAction.GET_EVENT_COUNTRY_LIST),
        switchMap( (actionObject) =>
            this.appService.loadEventCountryList(actionObject['payload']).pipe(
                map((resp) => {
                    if (resp.status === 'error') {
                        return new appAction.GetEventCountryListFailed({ status: 'Failed'});
                    } else {
                        return new appAction.GetEventCountryListSuccess(resp.contryList);
                    }
                }),
                catchError((err) => of({ type: appAction.GET_COUNTRY_LIST_FAILED, payload: err }))
            )
        )
        );
}
