import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormlyModule } from '@ngx-formly/core';
import { ImageUploadModule } from 'src/app/shared/modules';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ProductsubRoutingModule } from './productsub-routing.module';
import { ProductsubComponent } from './productsub.component';
import { ProductsubFormComponent } from './productsub-form/productsub-form.component';
import { ProductsubListComponent } from './productsub-list/productsub-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProductsubRoutingModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    ImageUploadModule,
    NgbModule,
    SharedModule
  ],
  declarations: [ProductsubComponent, ProductsubFormComponent, ProductsubListComponent]
})
export class ProductsubModule { }
