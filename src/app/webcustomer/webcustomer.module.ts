import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcustomerComponent } from './webcustomer.component';
import { WebcustomerRoutingModule } from './webcustomer-routing.module';
import { FormsModule } from '@angular/forms';
import { PageLoadingModule } from '../shared/modules/page-loading/page-loading.module';
import { WebcustomerDetailsComponent } from './webcustomer-details/webcustomer-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    WebcustomerRoutingModule,
    FormsModule,
    PageLoadingModule,
    SharedModule
  ],
  declarations: [WebcustomerComponent, WebcustomerDetailsComponent]
})
export class WebcustomerModule { }
