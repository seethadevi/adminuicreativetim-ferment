import { Routes } from '@angular/router';

export const SubhomeChildRoutes: Routes = [
    {
        path: '',
        loadChildren: './../subscription-dashboard/subscription-dashboard.module#SubscriptionDashboardModule',
    }, {
        path: 'subscriptiondashboard',
        loadChildren: './../subscription-dashboard/subscription-dashboard.module#SubscriptionDashboardModule',
    }, {
        path: 'subscriptionhome',
        loadChildren: './../subhome/subhome.module#SubhomeModule'
    }, {
        path: 'shop',
        loadChildren: './../shop/shop.module#ShopModule'
    }, {
        path: 'warehouse',
        loadChildren: './../warehouse/warehouse.module#WarehouseModule'
    }, {
        path: 'settings',
        loadChildren: './../settings/settings.module#SettingsModule'
    }, {
        path: 'channel',
        loadChildren: './../channel/channel.module#ChannelModule'
    }, {
        path: 'notification',
        loadChildren: './../notification/notification.module#NotificationModule'
    }, {
        path: 'productsub',
        loadChildren: './../productsub/productsub.module#ProductsubModule'
    }, {
        path: 'employee',
        loadChildren: './../employee/employee.module#EmployeeModule'
    }, {
        path: 'vendorsub',
        loadChildren: './../vendorsub/vendorsub.module#VendorsubModule'
    }, {
        path: 'webcustomer',
        loadChildren: './../webcustomer/webcustomer.module#WebcustomerModule'
    }, {
        path: 'producersub',
        loadChildren: './../producersub/producersub.module#ProducersubModule'
    }, {
        path: 'productsub',
        loadChildren: './../productsub/productsub.module#ProductsubModule'
    }, {
        path: 'appemailtemplatesub',
        loadChildren: './../email-templatesub/email-templatesub.module#EmailTemplatesubModule'
    }
];
