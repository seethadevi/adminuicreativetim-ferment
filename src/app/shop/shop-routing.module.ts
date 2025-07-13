import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopFormComponent } from './shop-form/shop-form.component';
import { ShopproductListComponent } from './shopproduct-list/shopproduct-list.component';
import { ShopproductRevertWarehouseComponent } from './shopproduct-revert-warehouse/shopproduct-revert-warehouse.component';
import { ShopproductFormComponent } from './shopproduct-form/shopproduct-form.component';
import { ShopproductAddrecommendationsComponent } from './shopproduct-addrecommendations/shopproduct-addrecommendations.component';
import { ShopproductWarehouseComponent } from './shopproduct-warehouse/shopproduct-warehouse.component';
import { WeezeventListComponent } from './weezevent-list/weezevent-list.component';
import { ShopTariffComponent } from './shop-tariff/shop-tariff.component';
import { ShopDetailsViewComponent } from './shop-details-view/shop-details-view.component';
import { EventshopTicketComponent } from './eventshop-ticket/eventshop-ticket.component';
import { EventshopCustomerComponent } from './eventshop-customer/eventshop-customer.component';


const routes: Routes = [
  {
    path: '', component: ShopListComponent,
  },
  {
    path: 'new', component: ShopFormComponent,
  },
  {
    path: 'weezeventlist', component: WeezeventListComponent,
  },
  {
    path: 'update/:id', component: ShopFormComponent,
  }, {
    path: 'new/:event_id', component: ShopFormComponent,
  },
  {
    path: 'shopproductlist', component: ShopproductListComponent,
  },
  // {
  //   path: 'revertwarehouse', component: ShopproductRevertWarehouseComponent,
  // },
  // {
  //   path: 'shopproduct/new', component: ShopproductFormComponent,
  // },
  // {
  //   path: 'shopproduct/update/:id', component: ShopproductFormComponent,
  // },
  // {
  //   path: 'shopproduct/recommendations/:id', component: ShopproductAddrecommendationsComponent,
  // },
  // {
  //   path: 'shopproduct/warehouse', component: ShopproductWarehouseComponent,
  // },
  {
    path: 'detailview', component: ShopDetailsViewComponent,
    children: [
      {
        path: 'shopproductlist', component: ShopproductListComponent
      }, {
        path: 'shopproduct/new', component: ShopproductFormComponent
      }, {
        path: 'shopproduct/update/:id', component: ShopproductFormComponent,
      }, {
        path: 'shopproduct/recommendations/:id', component: ShopproductAddrecommendationsComponent,
      }, {
        path: 'shopproduct/warehouse/:option', component: ShopproductWarehouseComponent,
      }, {
        path: 'tariff', component: ShopTariffComponent
      }, {
        path: 'eventtickets', component: EventshopTicketComponent
      }, {
        path: 'eventvisitors', component: EventshopCustomerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
