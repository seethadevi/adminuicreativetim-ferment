import { WarehouseComponent } from './warehouse.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { WarehouseproductListComponent } from './warehouseproduct-list/warehouseproduct-list.component';
import { WarehouseproductComponent } from './warehouseproduct/warehouseproduct.component';

const routes: Routes = [
    {
      path: 'warehouseproductlist', component: WarehouseproductListComponent,
    },
    {
      path: 'warehouseproduct/new', component: WarehouseproductComponent,
    },
    {
      path: 'warehouseproduct/update/:id', component: WarehouseproductComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WarehouseRoutingModule {}
