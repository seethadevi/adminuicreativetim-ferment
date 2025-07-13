import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseproductListComponent } from './warehouseproduct-list/warehouseproduct-list.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseproductComponent } from './warehouseproduct/warehouseproduct.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from '../shared/modules';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TagInputModule } from 'ngx-chips';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { QRCodeModule } from 'angularx-qrcode';
import { CommondirectiveModule } from '../shared/directives/commondirective.module';
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';
import { MaterialModule } from '../app.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [WarehouseComponent, WarehouseproductListComponent, WarehouseproductComponent],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    NgbModule,
    ImageUploadModule,
    FormsModule,
    SweetAlert2Module,
    TagInputModule,
    SharedModule,
    QRCodeModule,
    CommondirectiveModule,
    NgxInfiniteScrollerModule,
    InfiniteScrollModule,
    MaterialModule
  ]
})
export class WarehouseModule { }
