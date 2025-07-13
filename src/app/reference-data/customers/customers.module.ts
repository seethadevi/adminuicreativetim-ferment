import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersComponent } from './customers.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomersRoutingModule } from './customer-routing';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommondirectiveModule } from 'src/app/shared/directives/commondirective.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [CustomersComponent, CustomerFormComponent, CustomerListComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    SharedModule,
    SweetAlert2Module
  ]
})
export class CustomersModule { }
