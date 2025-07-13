import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EmployeeComponent } from './employee.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PageLoadingModule } from '../shared/modules/page-loading/page-loading.module';
import { CommondirectiveModule } from '../shared/directives/commondirective.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { ImageUploadModule } from 'src/app/shared/modules';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EmployeeRoutingModule,
    SweetAlert2Module,
    PageLoadingModule,
    CommondirectiveModule,
    ImageUploadModule,
    SharedModule,
    NgbModule,
    TagInputModule
  ],
  declarations: [EmployeeComponent, EmployeeFormComponent, EmployeeListComponent]
})
export class EmployeeModule { }
