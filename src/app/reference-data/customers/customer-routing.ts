import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';


const routes: Routes = [
  {
    path: '', component: CustomerListComponent,
  },
  {
    path: 'new', component: CustomerFormComponent,
  },
  {
    path: 'update/:id', component: CustomerFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
