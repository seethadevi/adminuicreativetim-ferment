import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationFormComponent } from './location-form/location-form.component';
import { LocationListComponent } from './location-list/location-list.component';
import { FormsModule } from '@angular/forms';
import { LocationRoutingModule } from './location-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageUploadModule } from 'src/app/shared/modules';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from 'src/app/app.module';

@NgModule({
  declarations: [LocationFormComponent, LocationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SweetAlert2Module,
    SharedModule,
    LocationRoutingModule,
    ImageUploadModule,
    TagInputModule,
    MaterialModule
  ]
})
export class LocationModule { }
