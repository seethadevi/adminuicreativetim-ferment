import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WineryComponent } from './winery.component';
import { WineryFormComponent } from './winery-form/winery-form.component';
import { WineryListComponent } from './winery-list/winery-list.component';
import { RouterModule } from '@angular/router';

import {WineryRoutes } from './winery-routing';

import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from 'src/app/shared/modules';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [WineryComponent, WineryFormComponent, WineryListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(WineryRoutes),
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    FormsModule,
    // FormlyModule.forRoot(),
    // FormlyBootstrapModule,
    ImageUploadModule,
    NgbModule,
    QRCodeModule

  ]
})
export class WineryModule { }
