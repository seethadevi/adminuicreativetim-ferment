import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsubFormComponent } from './vendorsub-form/vendorsub-form.component';
import { VendorsubListComponent } from './vendorsub-list/vendorsub-list.component';

const routes: Routes = [
  {
    path: '', component: VendorsubListComponent,
  },
  {
    path: 'new', component: VendorsubFormComponent,
  },
  {
    path: 'update/:id', component: VendorsubFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsubRoutingModule { }
