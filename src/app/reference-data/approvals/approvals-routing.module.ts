import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApprovalsListComponent } from './approvals-list/approvals-list.component';
import { ApprovalsDetailProductComponent } from './approvals-detail-product/approvals-detail-product.component';
import { ApprovalsDetailProducerComponent } from './approvals-detail-producer/approvals-detail-producer.component';

const routes: Routes = [
  {
    path: '', component: ApprovalsListComponent,
  },
  {
    path: 'detailproduct/:id', component: ApprovalsDetailProductComponent,
  },
  {
    path: 'detailproducer/:id', component: ApprovalsDetailProducerComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ApprovalsRoutingModule {}
