import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentralwarehouseFormComponent } from './centralwarehouse-form/centralwarehouse-form.component';
import { CentralwarehouseproductListComponent } from './centralwarehouseproduct-list/centralwarehouseproduct-list.component';
import { CentralwarehouseproductComponent } from './centralwarehouseproduct/centralwarehouseproduct.component';
import { CentralwarehouseComponent } from './centralwarehouse.component';

const routes: Routes = [
  {
    path: '', component: CentralwarehouseComponent,
  },
  // {
  //   path: 'update/:id', component: CentralwarehouseFormComponent,
  // },
  // {
  //   path: 'new', component: CentralwarehouseFormComponent,
  // },
  {
    path: 'centralwarehouseproductlist', component: CentralwarehouseproductListComponent,
  },
  {
    path: 'centralwarehouseproduct/new', component: CentralwarehouseproductComponent,
  },
  {
    path: 'centralwarehouseproduct/update/:id', component: CentralwarehouseproductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentralwarehouseRoutingModule { }
