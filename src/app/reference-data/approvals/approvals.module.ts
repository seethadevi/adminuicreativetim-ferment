import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalsListComponent } from './approvals-list/approvals-list.component';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ImageUploadModule } from 'src/app/shared/modules';
import { MaterialModule } from 'src/app/app.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApprovalsRoutingModule } from './approvals-routing.module';
import { ApprovalsDetailProductComponent } from './approvals-detail-product/approvals-detail-product.component';
import { ApprovalsDetailProducerComponent } from './approvals-detail-producer/approvals-detail-producer.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ApprovalsListComponent, ApprovalsDetailProductComponent, ApprovalsDetailProducerComponent],
  imports: [
    CommonModule,
    ApprovalsRoutingModule,
    FormsModule,
    SweetAlert2Module,
    ImageUploadModule,
    MaterialModule,
    SharedModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    NgbModule
  ]
})
export class ApprovalsModule { }
