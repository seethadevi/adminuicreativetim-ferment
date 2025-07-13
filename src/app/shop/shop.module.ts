import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { SelectModule } from 'ng2-select';
import { QRCodeModule } from 'angularx-qrcode';

import { ShopComponent } from './shop.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopFormComponent } from './shop-form/shop-form.component';
import { AgmCoreModule } from '@agm/core';
import { ImageUploadModule } from '../shared/modules/image-upload/image-upload.module';
import { ShopproductListComponent } from './shopproduct-list/shopproduct-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { ShopproductRevertWarehouseComponent } from './shopproduct-revert-warehouse/shopproduct-revert-warehouse.component';
import { ShopproductFormComponent } from './shopproduct-form/shopproduct-form.component';
import { ShopproductAddrecommendationsComponent } from './shopproduct-addrecommendations/shopproduct-addrecommendations.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopproductWarehouseComponent } from './shopproduct-warehouse/shopproduct-warehouse.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WeezeventListComponent } from './weezevent-list/weezevent-list.component';
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';
import { EventshopCustomerComponent } from './eventshop-customer/eventshop-customer.component';
import { EventshopTicketComponent } from './eventshop-ticket/eventshop-ticket.component';
import { ShopTariffComponent } from './shop-tariff/shop-tariff.component';
import { ShopDetailsViewComponent } from './shop-details-view/shop-details-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { EventDateDisplayPipe } from '../shared/pipes/event-date-display.pipe';
import { EventDateClosemsgPipe } from '../shared/pipes/event-date-closemsg.pipe';

@NgModule({
  declarations: [ShopComponent,
                  ShopListComponent,
                  ShopFormComponent, ShopproductListComponent, ShopproductRevertWarehouseComponent, ShopproductFormComponent,
    ShopproductAddrecommendationsComponent, ShopproductWarehouseComponent, WeezeventListComponent, EventDateClosemsgPipe,
    EventshopCustomerComponent, EventshopTicketComponent, ShopTariffComponent, ShopDetailsViewComponent, EventDateDisplayPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ImageUploadModule,
    QRCodeModule,
    MaterialModule,
    ShopRoutingModule,
    TagInputModule,
    AgmCoreModule,
    NgbModule,
    DragulaModule,
    NgSelectModule,
    SweetAlert2Module,
    NgxInfiniteScrollerModule,
    InfiniteScrollModule,
    SharedModule
  ]
})
export class ShopModule { }
