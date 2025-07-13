import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplogoutComponent } from './applogout.component';

const routes: Routes = [
  {
    path: '', component: ApplogoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplogoutRoutingModule { }
