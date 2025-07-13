import { Action } from '@ngrx/store';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_LOGIN_SESSION = 'USER_LOGIN_SESSION';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';
export const CLEAR_USER_RESPONSE = 'CLEAR_USER_RESPONSE';

export class UserLoginSuccess implements Action {
    readonly type = USER_LOGIN_SUCCESS;
    constructor(public payload: any) { }
}
export class UserLoginFailed implements Action {
    readonly type = USER_LOGIN_FAILED;
    constructor(public payload: any) { }
}

export const USER_SELECT_SUBSCRIPTION = 'USER_SELECT_SUBSCRIPTION';
export const SELECT_SUBSCRIPTION = 'SELECT_SUBSCRIPTION';
export const SELECT_SUBSCRIPTION_SUCCESS = 'SELECT_SUBSCRIPTION_SUCCESS';
export const SELECT_SUBSCRIPTION_FAILED = 'SELECT_SUBSCRIPTION_FAILED';

export class SelectSubscriptionSuccess implements Action {
    readonly type = SELECT_SUBSCRIPTION_SUCCESS;
    constructor(public payload: any) { }
}
export class SelectSubscriptionFailed implements Action {
    readonly type = SELECT_SUBSCRIPTION_FAILED;
    constructor(public payload: any) { }
}


export const ADD_USER = 'ADD_USER';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAILED = 'ADD_USER_FAILED';

export class AddUserSuccess implements Action {
    readonly type = ADD_USER_SUCCESS;
    constructor(public payload: any) { }
}
export class AddUserFailed implements Action {
    readonly type = ADD_USER_FAILED;
    constructor(public payload: any) { }
}

export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';

export class UpdateUserSuccess implements Action {
    readonly type = UPDATE_USER_SUCCESS;
    constructor(public payload: any) { }
}
export class UpdateUserFailed implements Action {
    readonly type = UPDATE_USER_FAILED;
    constructor(public payload: any) { }
}

export const GET_USER = 'GET_USER';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'GET_USER_FAILED';

export class GetUserSuccess implements Action {
    readonly type = GET_USER_SUCCESS;
    constructor(public payload: any) { }
}
export class GetUserFailed implements Action {
    readonly type = GET_USER_FAILED;
    constructor(public payload: any) { }
}

export const GET_ALL_USER = 'GET_ALL_USER';
export const GET_ALL_USER_SUCCESS = 'GET_ALL_USER_SUCCESS';
export const GET_ALL_USER_FAILED = 'GET_ALL_USER_FAILED';

export class GetAllUserSuccess implements Action {
    readonly type = GET_ALL_USER_SUCCESS;
    constructor(public payload: any) { }
}
export class GetAllUserFailed implements Action {
    readonly type = GET_ALL_USER_FAILED;
    constructor(public payload: any) { }
}

export const SELECT_SHOP = 'SELECT_SHOP';
export const SHOWHIDE_APP_LOADING = 'SHOWHIDE_APP_LOADING';


export const GET_COUNTRY_LIST = 'GET_COUNTRY_LIST';
export const GET_COUNTRY_LIST_SUCCESS = 'GET_COUNTRY_LIST_SUCCESS';
export const GET_COUNTRY_LIST_FAILED = 'GET_COUNTRY_LIST_FAILED';

export class GetCountryListSuccess implements Action {
    readonly type = GET_COUNTRY_LIST_SUCCESS;
    constructor(public payload: any) { }
}
export class GetCountryListFailed implements Action {
    readonly type = GET_COUNTRY_LIST_FAILED;
    constructor(public payload: any) { }
}

export const GET_EVENT_COUNTRY_LIST = 'GET_EVENT_COUNTRY_LIST';
export const GET_EVENT_COUNTRY_LIST_SUCCESS = 'GET_EVENT_COUNTRY_LIST_SUCCESS';
export const GET_EVENT_COUNTRY_LIST_FAILED = 'GET_EVENT_COUNTRY_LIST_FAILED';

export class GetEventCountryListSuccess implements Action {
    readonly type = GET_EVENT_COUNTRY_LIST_SUCCESS;
    constructor(public payload: any) { }
}
export class GetEventCountryListFailed implements Action {
    readonly type = GET_EVENT_COUNTRY_LIST_FAILED;
    constructor(public payload: any) { }
}
