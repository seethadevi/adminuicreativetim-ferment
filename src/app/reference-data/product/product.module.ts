import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { Router, RouterModule } from '@angular/router';
import { ProductRoutes } from './product-routing';
import { ProductListComponent } from './product-list/product-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductFormComponent } from './product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormlyModule } from '@ngx-formly/core';
import { ImageUploadModule } from 'src/app/shared/modules';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { SelectDropDownModule } from 'ngx-select-dropdown';


@NgModule({
  declarations: [ProductComponent, ProductListComponent, ProductFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductRoutes),
    SharedModule,
    FormsModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    ImageUploadModule,
    NgbModule,
    SelectDropDownModule
  ]
})
export class ProductModule { }
