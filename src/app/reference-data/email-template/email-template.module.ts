import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplateFormComponent } from './email-template-form/email-template-form.component';
import { EmailTemplateListComponent } from './email-template-list/email-template-list.component';
import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { ImageUploadModule, EmailEditorModule } from 'src/app/shared/modules';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from '../../app.module';

@NgModule({
  declarations: [EmailTemplateFormComponent, EmailTemplateListComponent],
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    ImageUploadModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule,
    MaterialModule,
    EmailEditorModule
  ]
})
export class EmailTemplateModule { }
