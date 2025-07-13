import { Routes } from '@angular/router';

import { ChoosesubscriptionComponent } from './choosesubscription.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';

export const ChoosesubscriptionRoutes: Routes = [{
  path: '',
  children: [ {
      path: 'choosesubscription', component: ChoosesubscriptionComponent
    }, {
      path: 'subscription/new', component: SubscriptionFormComponent,
    }, {
      path: 'subscription/update/:id', component: SubscriptionFormComponent,
    }]
}];
