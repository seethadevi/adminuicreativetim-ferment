import { Component, OnInit, OnDestroy } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { AppService } from '../shared/services/app.service';
declare const $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    userRole?: string[];
    accessPlan?: string[];
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}


// Menu Items - For SUPER and ROOT ADMIN USERS
export const ROUTES: RouteInfo[] = [{
    path: '/choosesubscription',
    title: 'Choose Subscription',
    type: 'link',
    icontype: 'list',
    userRole: ['SUPER_ADMIN', 'ROOT_ADMIN']
},
    // {

    // path: '/dashboard',
    // title: 'Admin Dashboard',
    // type: 'link',
    // icontype: 'dashboard',
    // userRole: ['SUPER_ADMIN', 'ROOT_ADMIN']
    // },
    {
    path: '/reference',
    title: 'Reference Data',
    type: 'sub',
    icontype: 'apps',
    collapse: 'reference',
    userRole: ['SUPER_ADMIN', 'ROOT_ADMIN'],
    children: [
        {path: 'winery', title: 'Producer', ab: 'PDR'},
        {path: 'product', title: 'Product', ab: 'PDT'},
        {path: 'centralwarehouse', title: 'Fermynt Warehouse', ab: 'FWH'},
        {path: 'vendor', title: 'Vendor/Supplier', ab: 'VS'},
        {path: 'taxclass', title: 'Tax Class', ab: 'TC'},
        {path: 'customer', title: 'Customer', ab: 'C'},
        {path: 'approvals', title: 'Approval Action', ab: 'AA'},
        {path: 'dynamicform', title: 'Dynamic Form', ab: 'DF'},
        { path: 'reflocation', title: 'Location', ab: 'L' },
        { path: 'bannerpromotion', title: 'Banner Promotion', ab: 'BP' },
        // {path: 'appemailtemplate', title: 'Email Template', ab: 'ET'},
    ]
}, {
    path: '/applogout',
    title: 'Logout',
    type: 'link',
    icontype: 'power_settings_new',
    userRole: ['SUPER_ADMIN', 'ROOT_ADMIN']
}
];

export const SUB_MENUS: RouteInfo[] = [
    {
        path: '/subscriptionhome/subscriptiondashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/shop',
        title: 'Event',
        type: 'link',
        icontype: 'home',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/warehouse/warehouseproductlist',
        title: 'Warehouse',
        type: 'link',
        icontype: 'folder',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/webcustomer',
        title: 'Customer',
        type: 'link',
        icontype: 'person',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/channel',
        title: 'Channel',
        type: 'link',
        icontype: 'tv',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/productsub',
        title: 'Product',
        type: 'link',
        icontype: 'settings_input_composite',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/producersub',
        title: 'Producer',
        type: 'link',
        icontype: 'perm_identity',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/custOrders',
        title: 'Orders',
        type: 'link',
        icontype: 'money',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/employee',
        title: 'Employee',
        type: 'link',
        icontype: 'supervised_user_circle',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    },  {
        path: '/subscriptionhome/vendorsub',
        title: 'Vendor / Supplier',
        type: 'link',
        icontype: 'assignment_ind',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/notification',
        title: 'Notification',
        type: 'link',
        icontype: 'notifications',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/subscriptionhome/appemailtemplatesub',
        title: 'Email Template',
        type: 'link',
        icontype: 'email',
        userRole: ['SUPER_ADMIN', 'ROOT_ADMIN', 'SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }, {
        path: '/applogout',
        title: 'Logout',
        type: 'link',
        icontype: 'power_settings_new',
        userRole: ['SUBSCRIPTION'],
        accessPlan: ['SILVER', 'GOLD', 'PLATINUM']
    }
    // {
    //     path: '/subscriptionhome/productsub',
    //     title: 'Products',
    //     type: 'link',
    //     icontype: 'folder'
    // }
];

// Menu Items - For ADMIN USERS
export const ROUTES1: RouteInfo[] = [{
    path: '/choosesubscription',
    title: 'Choose Subscription',
    type: 'link',
    icontype: 'list',
    userRole: ['SUPER_ADMIN']
}, {
    path: '/dashboard',
    title: 'Admin Dashboard',
    type: 'link',
    icontype: 'dashboard',
    userRole: ['SUPER_ADMIN']
}, {
    path: '/reference',
    title: 'Reference Data',
    type: 'sub',
    icontype: 'apps',
    collapse: 'reference',
    userRole: ['SUPER_ADMIN'],
    children: [
        {path: 'winery', title: 'Producer', ab: 'PDR'},
        {path: 'product', title: 'Product', ab: 'PDT'},
        {path: 'centralwarehouse', title: 'Fermynt Warehouse', ab: 'FWH'},
        {path: 'vendor', title: 'Vendor/Supplier', ab: 'VS'},
        {path: 'taxclass', title: 'Tax Class', ab: 'TC'},
        {path: 'customer', title: 'Customer', ab: 'C'},
        // {path: 'approval-action', title: 'Approval Action', ab: 'AA'},
        { path: 'dynamicform', title: 'Dynamic Form', ab: 'DF' },
        { path: 'reflocation', title: 'Location', ab: 'L' },
        { path: 'bannerpromotion', title: 'Banner Promotion', ab: 'BP' },
        // {path: 'appemailtemplate', title: 'Email Template', ab: 'ET'},
    ]
}, {
    path: '/applogout',
    title: 'Logout',
    type: 'link',
    icontype: 'power_settings_new',
    userRole: ['SUPER_ADMIN']
}
];

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
    public menuItems: any[];
    ps: any;
    sub_name: any;
    sub_name_firstletter: any;
    currentPath: any;
    subPicture: any;
    userRole = '';
    isSubHome: boolean;
    location: Location;
    subprofileSubscription: any;
    susbscriptionId: '';
    susbscriptionName: '';
    userSubscription: any;
    subMenusList: any;
    subPlan: any;
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
    constructor(private router: Router, private store: Store<any>, location: Location, private appService: AppService) {
        this.location = location;
    }
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
        this.getSubStatus();
        this.subMenusList = SUB_MENUS.filter(menuItem => menuItem);
        this.userSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
            this.userRole = s.appMainStore.loggedInUser.role;
            this.susbscriptionId = s.appMainStore.subscriptionId;
            this.susbscriptionName = s.appMainStore.currentlySelectedSubscription;
            this.sub_name_firstletter =  s.appMainStore.currentlySelectedSubscription.slice(0, 1);
            this.subPicture = s.appMainStore.subPicture;
            this.sub_name = s.appMainStore.currentlySelectedSubscription;
            this.subPlan = s.appMainStore.subPlan;
            if (this.userRole === 'SUPER_ADMIN' || this.userRole === 'ROOT_ADMIN') {
                this.menuItems = ROUTES.filter(menuItem => menuItem);
            } else if (this.userRole === 'SUBSCRIPTION') {
                this.menuItems = [];
            } else {
                this.menuItems = ROUTES1.filter(menuItem => menuItem);
            }
        });
    }
    ngOnDestroy() {
      if (!!this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
    }

    changeSubscription() {
        this.appService.gotoURL('/choosesubscription');
    }

    goTosubscriptionEditView() {
        this.appService.gotoURL('subscription/update/' + this.susbscriptionId);
    }

    goToChannel() {
        this.appService.gotoURL('/channel');
    }

    goToSettings() {
        this.appService.gotoURL('subscriptionhome/settings');
    }

    getSubStatus() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice( 1 );
            if (titlee.includes('/subscriptionhome')) {
                this.isSubHome = true;
                // this.subprofileSubscription = this.store.select<any>((state: any) => state)
                //     .subscribe((s: any) => {
                // });
                this.currentPath = this.router.url;
            } else {
                this.isSubHome = false;
            }
        }
        return this.isSubHome;
    }
    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
