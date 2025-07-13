import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsubListComponent } from './productsub-list/productsub-list.component';
import { ProductsubFormComponent } from './productsub-form/productsub-form.component';

const routes: Routes = [
  {
    path: '', component: ProductsubListComponent,
  },
  {
    path: ':option', component: ProductsubListComponent,
  },
  {
    path: 'product/new', component: ProductsubFormComponent,
  },
  {
    path: 'update/:id', component: ProductsubFormComponent,
  },
  {
    path: 'pendingupdate/:id', component: ProductsubFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsubRoutingModule { }
