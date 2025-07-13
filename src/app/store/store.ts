import * as appAction from '../action/app-actions';
import { User } from './../shared/models/user.model';


export interface LoggedUser {
    userId?: string;
    role: string;
    name: string;
    firstName: string;
    lastName: string;
    email?: string;
    mobile?: string;
    isLoginProgress: boolean;
    isValidUser: boolean;
    error: any;
    token: string;
    channel: string;
    orgId: string;
    status: String;
    subscriptionId: String;
}
export interface AddResponseSchema {
    status?: string;
    id?: string;
    msg?: string;
}

// AppState will store all the data for Application
export interface AppState {
    loggedInUser: LoggedUser;
    isAppLoading: boolean;
    error: any;
    subscriptionId: String;
    currentlySelectedSubscription: string;
    subPicture: {};
    subPlan: string;
    warehouseId: string;
    warehouseName: string;
    userSaveResponse: AddResponseSchema;
    allUserList: User[];
    shopId: string;
    shopName: string;
    list_of_country: any[];
    list_of_event_country: any[];

}

// Initial State of the Application
export const INIT_STATE: AppState = {
    loggedInUser: {
        userId: '',
        role: '',
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        isLoginProgress: false,
        isValidUser: false,
        error: null,
        token: '',
        channel: '',
        orgId: '',
        status: '',
        subscriptionId: ''
    },
    isAppLoading: false,
    error: '',
    subscriptionId: '',
    currentlySelectedSubscription: '',
    subPlan: '',
    subPicture: {},
    warehouseId: '',
    warehouseName: '',
    userSaveResponse: { status: '', id: '', msg: '' },
    allUserList: [],
    shopId: '',
    shopName: '',
    list_of_country: [],
    list_of_event_country: []
};

// Root Reducer
export function rootReducer(state: AppState = INIT_STATE, action): AppState {
    // console.log('Received Action ---->>>>', action);
    switch (action.type) {
        // All User Actions here...
        case appAction.USER_LOGIN: return Object.assign({}, state, {
            loggedInUser: Object.assign({}, state, {
                isLoginProgress: true,
                isValidUser: false,
                error: null
            }),
            isAppLoading: true
        });
        case appAction.USER_LOGOUT: return Object.assign({} , state, INIT_STATE);

        case appAction.USER_LOGIN_SUCCESS: return Object.assign({}, state, {
            loggedInUser: Object.assign({}, state.loggedInUser, {
                isLoginProgress: false,
                isValidUser: true,
                error: null,
                userId: action.payload.user._id,
                role: action.payload.user.role,
                name: action.payload.user.firstname + ' ' + action.payload.user.lastname,
                firstName: action.payload.user.firstname,
                lastName: action.payload.user.lastname,
                email: action.payload.user.email,
                mobile: action.payload.user.mobile,
                orgId: action.payload.user.org_id,
                token: action.payload.session_id,
                subscriptionId: action.payload.user._id,
                status: action.payload.status
            }),
            subscriptionId: action.payload.user.role === 'SUBSCRIPTION' ? action.payload.user._id : '',
            subPicture: action.payload.user.role === 'SUBSCRIPTION' ? action.payload.user.picture : '',
            subPlan: action.payload.user.role === 'SUBSCRIPTION' ? action.payload.user.plan : '',
            currentlySelectedSubscription: action.payload.user.role === 'SUBSCRIPTION' ? action.payload.user.firstname : '',
            isAppLoading: false
        });

        case appAction.USER_LOGIN_SESSION: return Object.assign({}, state, {
            loggedInUser: Object.assign({}, state.loggedInUser, {
                isLoginProgress: false,
                isValidUser: true,
                error: null,
                userId: action.payload.userId,
                role: action.payload.role,
                name: action.payload.firstname + ' ' + action.payload.lastname,
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                email: action.payload.email,
                mobile: action.payload.mobile,
                subscriptionId: action.payload.userId,
                status: 'success'
            }),
            subscriptionId : action.payload.role === 'SUBSCRIPTION' ? action.payload.userId : '',
            currentlySelectedSubscription: action.payload.role === 'SUBSCRIPTION' ? action.payload.firstname : '',
        });

        case appAction.USER_LOGIN_FAILED: return Object.assign({}, state, {
            loggedInUser: Object.assign({}, state.loggedInUser, {
                isLoginProgress: false,
                isValidUser: false,
                error: action.payload.msg,
                status: action.payload.status
            }), isAppLoading: false
        });

        case appAction.SELECT_SUBSCRIPTION: return Object.assign({}, state, {
            currentlySelectedSubscription: action.payload.name,
            subscriptionId: action.payload.id,
            subPicture: action.payload.picture,
            subPlan: action.payload.plan
        });

        case appAction.SELECT_SUBSCRIPTION_SUCCESS: return Object.assign({}, state, {
            warehouseId: action.payload.id,
            warehouseName: action.payload.name
        });

        case appAction.SELECT_SUBSCRIPTION_FAILED: return Object.assign({}, state, {
            error: action.payload.msg
        });

        // Select Shop
        case appAction.SELECT_SHOP: return Object.assign({}, state, {
            shopId: action.payload.id,
            shopName: action.payload.name
        });

        case appAction.ADD_USER: return Object.assign({}, state, {
            isAppLoading: true,
            error: ''
        });

        case appAction.ADD_USER_SUCCESS: return Object.assign({}, state, {
            isAppLoading: false,
            error: '',
            userSaveResponse: action.payload
        });

        case appAction.ADD_USER_FAILED: return Object.assign({}, state, {
            userSaveResponse: action.payload,
            isAppLoading: false,
            error: action.payload.msg
        });

        case appAction.CLEAR_USER_RESPONSE: return Object.assign({}, state, {
            userSaveResponse : { status: '', id: '', msg: '' },
            error: ''
        });

        case appAction.UPDATE_USER: return Object.assign({}, state, {
            isAppLoading: true,
            error: ''
        });

        case appAction.UPDATE_USER_SUCCESS: return Object.assign({}, state, {
            isAppLoading: false,
            error: '',
            userSaveResponse: action.payload
        });

        case appAction.UPDATE_USER_FAILED: return Object.assign({}, state, {
            userSaveResponse: action.payload,
            isAppLoading: false,
            error: action.payload.msg
        });

        case appAction.GET_USER: return Object.assign({}, state, {
            isAppLoading: true,
            error: ''
        });

        case appAction.GET_USER_SUCCESS: return Object.assign({}, state, {
            isAppLoading: false,
            error: '',
            allUserList: [action.payload.msg]
        });

        case appAction.GET_USER_FAILED: return Object.assign({}, state, {
            isAppLoading: false,
            error: action.payload.msg,
            allUserList: []
        });

        case appAction.SHOWHIDE_APP_LOADING: return Object.assign({}, state, {
            isAppLoading: action.payload.flag
        });

        case appAction.GET_COUNTRY_LIST_SUCCESS: return Object.assign({}, state, {
            list_of_country: action.payload
        });

        case appAction.GET_COUNTRY_LIST_FAILED: return Object.assign({}, state, {
            list_of_country: []
        });

        case appAction.GET_EVENT_COUNTRY_LIST_SUCCESS: return Object.assign({}, state, {
            list_of_event_country: action.payload
        });

        case appAction.GET_EVENT_COUNTRY_LIST_FAILED: return Object.assign({}, state, {
            list_of_event_country: []
        });

        default: return state;
    }
}
