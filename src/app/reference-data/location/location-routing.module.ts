import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationFormComponent } from './location-form/location-form.component';
import { LocationListComponent } from './location-list/location-list.component';

const routes: Routes = [
  {
    path: '', component: LocationListComponent,
  },
  {
    path: 'new', component: LocationFormComponent,
  },
  {
    path: 'update/:id', component: LocationFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class LocationRoutingModule {}
