import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubhomeComponent } from './subhome.component';
import { RouterModule, Routes } from '@angular/router';
import { SubhomeChildRoutes } from './subhome.child-routes';

const routes: Routes = [
  {
    path: '', component: SubhomeComponent,
    children: SubhomeChildRoutes
  }
];
@NgModule({
  declarations: [SubhomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SubhomeModule { }
