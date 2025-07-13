import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelFormComponent } from './channel-form/channel-form.component';
import { ChannelListComponent } from './channel-list/channel-list.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ChannelRoutingModule } from './channel-routing.module';
import { ImageUploadModule } from '../shared/modules';
import { MaterialModule } from '../app.module';
import { ChannelCustomerComponent } from './channel-customer/channel-customer.component';
import { ChannelRequestComponent } from './channel-request/channel-request.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ChannelFormComponent, ChannelListComponent, ChannelCustomerComponent, ChannelRequestComponent],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    FormsModule,
    SweetAlert2Module,
    ImageUploadModule,
    MaterialModule,
    SharedModule
  ]
})
export class ChannelModule { }
