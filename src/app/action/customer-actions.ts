import { Action } from '@ngrx/store';

export const TOGGLE_CUSTOMER_FORM = 'TOGGLE_CUSTOMER_FORM';
export const GET_CUSTOMER = 'GET_CUSTOMER';
export const GET_CUSTOMER_SUCCESS = 'GET_CUSTOMER_SUCCESS';
export const GET_CUSTOMER_FAILED = 'GET_CUSTOMER_FAILED';

export class GetCustomerSuccess implements Action {
    readonly type = GET_CUSTOMER_SUCCESS;
    constructor(public payload: any) { }
}
export class GetCustomerFailed implements Action {
    readonly type = GET_CUSTOMER_FAILED;
    constructor(public payload: any) { }
}
