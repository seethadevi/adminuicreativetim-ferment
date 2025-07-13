import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotpasswordComponent } from './forgotpassword.component';
import { ForgotRoutingModule } from './forgot-routing.module';
import { FormsModule } from '@angular/forms';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PageLoadingModule } from '../shared/modules';

@NgModule({
  imports: [
    CommonModule,
    ForgotRoutingModule,
    FormsModule,
    PageLoadingModule
  ],
  declarations: [ForgotpasswordComponent, ChangepasswordComponent]
})
export class ForgotpasswordModule { }
