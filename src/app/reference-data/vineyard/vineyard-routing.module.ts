import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VineyardComponent } from './vineyard.component';
import { VineyardListComponent } from './vineyard-list/vineyard-list.component';
import { VineyardFormComponent } from './vineyard-form/vineyard-form.component';

const routes: Routes = [
  {
    path: '', component: VineyardListComponent,
  },
  {
    path: 'new', component: VineyardFormComponent,
  },
  {
    path: 'update/:id', component: VineyardFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VineyardRoutingModule { }
