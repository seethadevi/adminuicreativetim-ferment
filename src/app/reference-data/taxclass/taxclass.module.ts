import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxclassComponent } from './taxclass.component';
import { TaxclassFormComponent } from './taxclass-form/taxclass-form.component';
import { TaxclassListComponent } from './taxclass-list/taxclass-list.component';
import { TaxclassRoutingModule } from './taxclass-routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TaxclassComponent, TaxclassFormComponent, TaxclassListComponent],
  imports: [
    CommonModule,
    TaxclassRoutingModule,
    SharedModule,
    SweetAlert2Module,
    FormsModule
  ]
})
export class TaxclassModule { }
