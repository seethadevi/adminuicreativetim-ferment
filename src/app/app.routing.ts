import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './shared/guard/auth.guard';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    }, {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    { path: 'forgotPassword', loadChildren: './forgotpassword/forgotpassword.module#ForgotpasswordModule' },
    {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [AuthGuard],
      children: [
        {
            path: '',
            loadChildren: './choosesubscription/choosesubscription.module#ChoosesubscriptionModule'
        }, {
            path: 'applogout',
            loadChildren: './applogout/applogout.module#ApplogoutModule'
        },
        {
            path: 'subscriptionhome',
            loadChildren: './subhome/subhome.module#SubhomeModule'
        },
        {
        path: 'reference',
        loadChildren: './reference-data/reference-data.module#ReferenceDataModule'
        }
  ]}
];
