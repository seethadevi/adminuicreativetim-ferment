import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplogoutComponent } from './applogout.component';
import { ApplogoutRoutingModule } from './applogout-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ApplogoutRoutingModule
  ],
  declarations: [ApplogoutComponent]
})
export class ApplogoutModule { }
