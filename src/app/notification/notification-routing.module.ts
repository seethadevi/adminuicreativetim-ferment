import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import { NotificationListComponent } from './notification-list/notification-list.component';

const routes: Routes = [
  {
    path: 'new', component: NotificationFormComponent,
  },
  {
    path: '', component: NotificationListComponent,
  },
  {
    path: 'update/:id', component: NotificationFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NotificationRoutingModule {}
