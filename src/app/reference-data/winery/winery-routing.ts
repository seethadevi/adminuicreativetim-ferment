import { Routes } from '@angular/router';

import { WineryListComponent } from './winery-list/winery-list.component';
import { WineryFormComponent } from './winery-form/winery-form.component';
export const WineryRoutes: Routes = [
    {
      path: '', component: WineryListComponent,
    },
    {
      path: 'new', component: WineryFormComponent,
    },
    {
      path: 'update/:id', component: WineryFormComponent,
    }
];
