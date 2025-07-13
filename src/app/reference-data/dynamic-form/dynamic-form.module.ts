import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormListComponent } from './dynamic-form-list/dynamic-form-list.component';
import { DynamicFormCreatorComponent } from './dynamic-form-creator/dynamic-form-creator.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommondirectiveModule } from 'src/app/shared/directives/commondirective.module';

export const dynamicformroutes: Routes = [
  {
    path: '', component: DynamicFormListComponent,
  },
  {
    path: 'new', component: DynamicFormCreatorComponent,
  },
  {
    path: 'update/:id', component: DynamicFormCreatorComponent,
  }
];

@NgModule({
  declarations: [DynamicFormComponent, DynamicFormListComponent, DynamicFormCreatorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dynamicformroutes),
    SharedModule,
    FormsModule,
    SweetAlert2Module,
    CommondirectiveModule
  ]
})
export class DynamicFormModule { }
