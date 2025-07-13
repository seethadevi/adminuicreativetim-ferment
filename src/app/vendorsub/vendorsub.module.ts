import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsubFormComponent } from './vendorsub-form/vendorsub-form.component';
import { VendorsubListComponent } from './vendorsub-list/vendorsub-list.component';
import { VendorsubRoutingModule } from './vendorsub-routing.module';
import { VendorsubComponent } from './vendorsub.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommondirectiveModule } from '../shared/directives/commondirective.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageUploadModule } from 'src/app/shared/modules';

@NgModule({
  imports: [
    CommonModule,
    VendorsubRoutingModule,
    FormsModule,
    SweetAlert2Module,
    CommondirectiveModule,
    SharedModule,
    ImageUploadModule
  ],
  declarations: [VendorsubFormComponent, VendorsubListComponent, VendorsubComponent]
})
export class VendorsubModule { }
