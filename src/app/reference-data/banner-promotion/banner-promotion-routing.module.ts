import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BannerPromotionFormComponent } from './banner-promotion-form/banner-promotion-form.component';
import { BannerPromotionListComponent } from './banner-promotion-list/banner-promotion-list.component';

const routes: Routes = [
  {
    path: 'new', component: BannerPromotionFormComponent,
  },
  {
    path: '', component: BannerPromotionFormComponent,
  },
  {
    path: 'update/:id', component: BannerPromotionFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BannerPromotionRoutingModule {}
