import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebcustomerComponent } from './webcustomer.component';

const routes: Routes = [
  {
    path: '', component: WebcustomerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebcustomerRoutingModule { }
