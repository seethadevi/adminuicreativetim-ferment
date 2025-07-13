import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {ReferenceDataRoutes} from './reference-data.routing';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(ReferenceDataRoutes),
  ]
})
export class ReferenceDataModule { }
