import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralwarehouseproductListComponent } from './centralwarehouseproduct-list/centralwarehouseproduct-list.component';
import { CentralwarehouseRoutingModule } from './centralwarehouse-routing.module';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PageLoadingModule } from '../shared';
import { CentralwarehouseFormComponent } from './centralwarehouse-form/centralwarehouse-form.component';
import { CentralwarehouseComponent } from './centralwarehouse.component';
import { CentralwarehouseproductComponent } from './centralwarehouseproduct/centralwarehouseproduct.component';
import { CommondirectiveModule } from './../../shared/directives/commondirective.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CentralwarehouseRoutingModule,
    FormsModule,
    SweetAlert2Module,
    TagInputModule,
    NgbModule,
    CommondirectiveModule,
    SharedModule
  ],
  declarations: [CentralwarehouseproductListComponent, CentralwarehouseFormComponent, CentralwarehouseComponent,
    CentralwarehouseproductComponent]
})
export class CentralwarehouseModule { }
