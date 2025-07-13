import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VineyardRoutingModule } from './vineyard-routing.module';
import { VineyardComponent } from './vineyard.component';
import { VineyardFormComponent } from './vineyard-form/vineyard-form.component';
import { VineyardListComponent } from './vineyard-list/vineyard-list.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VineyardRoutingModule,
    SweetAlert2Module,
    SharedModule
  ],
  declarations: [VineyardComponent, VineyardFormComponent, VineyardListComponent]
})
export class VineyardModule { }
