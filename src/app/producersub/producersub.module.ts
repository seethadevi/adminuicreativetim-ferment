import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProducersubComponent } from './producersub.component';
import { ProducersubFormComponent } from './producersub-form/producersub-form.component';
import { ProducersubListComponent } from './producersub-list/producersub-list.component';
import { RouterModule } from '@angular/router';


import { SharedModule } from 'src/app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule } from 'src/app/shared/modules';
import { QRCodeModule } from 'angularx-qrcode';
import { ProducersubRoutingModule } from './producersub-routing';


@NgModule({
  declarations: [ProducersubComponent, ProducersubFormComponent, ProducersubListComponent],
  imports: [
    CommonModule,
    ProducersubRoutingModule,
    SharedModule,
    SweetAlert2Module,
    ReactiveFormsModule,
    FormsModule,
    ImageUploadModule,
    NgbModule,
    QRCodeModule
  ]
})
export class ProducersubModule { }
