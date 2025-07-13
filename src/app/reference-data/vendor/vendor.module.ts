import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommondirectiveModule } from '../../shared/directives/commondirective.module';
import { ImageUploadModule } from 'src/app/shared/modules';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VendorRoutingModule,
    FormsModule,
    SweetAlert2Module,
    CommondirectiveModule,
    ImageUploadModule,
    SharedModule
  ],
  declarations: [VendorFormComponent, VendorListComponent, VendorComponent]
})
export class VendorModule { }
