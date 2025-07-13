import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationRoutingModule } from './notification-routing.module';
import { ImageUploadModule } from '../shared/modules';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../app.module';


@NgModule({
  declarations: [NotificationFormComponent, NotificationListComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    ImageUploadModule,
    TagInputModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule,
    MaterialModule
  ]
})
export class NotificationModule { }
