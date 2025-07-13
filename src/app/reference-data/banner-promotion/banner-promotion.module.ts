import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerPromotionFormComponent } from './banner-promotion-form/banner-promotion-form.component';
import { BannerPromotionRoutingModule } from './banner-promotion-routing.module';
import { ImageUploadModule } from 'src/app/shared/modules';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../app.module';
import { BannerPromotionListComponent } from './banner-promotion-list/banner-promotion-list.component';

@NgModule({
  declarations: [BannerPromotionFormComponent, BannerPromotionListComponent],
  imports: [
    CommonModule,
    BannerPromotionRoutingModule,
    ImageUploadModule,
    TagInputModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule,
    MaterialModule
  ]
})
export class BannerPromotionModule { }
