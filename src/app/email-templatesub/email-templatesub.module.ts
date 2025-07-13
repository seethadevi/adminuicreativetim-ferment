import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplatesubFormComponent } from './email-templatesub-form/email-templatesub-form.component';
import { EmailTemplatesubListComponent } from './email-templatesub-list/email-templatesub-list.component';
import { ImageUploadModule, EmailEditorModule } from 'src/app/shared/modules';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/app.module';
import { EmailTemplatesubRoutingModule } from './email-templatesub-routing.module';

@NgModule({
  declarations: [EmailTemplatesubFormComponent, EmailTemplatesubListComponent],
  imports: [
    CommonModule,
    EmailTemplatesubRoutingModule,
    ImageUploadModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule,
    MaterialModule,
    EmailEditorModule
  ]
})
export class EmailTemplatesubModule { }
