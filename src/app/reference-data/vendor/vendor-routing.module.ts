import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorFormComponent } from './vendor-form/vendor-form.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';

const routes: Routes = [
  {
    path: '', component: VendorListComponent,
  },
  {
    path: 'new', component: VendorFormComponent,
  },
  {
    path: 'update/:id', component: VendorFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
