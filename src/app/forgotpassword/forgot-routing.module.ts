import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotpasswordComponent } from './forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
    { path: '', component: ForgotpasswordComponent },
    { path: ':typeofuser/:id/changepassword', component: ChangepasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotRoutingModule { }
