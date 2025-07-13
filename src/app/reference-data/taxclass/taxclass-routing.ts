import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaxclassFormComponent } from './taxclass-form/taxclass-form.component';
import { TaxclassListComponent } from './taxclass-list/taxclass-list.component';

const routes: Routes = [
  {
    path: '', component: TaxclassListComponent,
  },
  {
    path: 'new', component: TaxclassFormComponent,
  },
  {
    path: 'update/:id', component: TaxclassFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TaxclassRoutingModule { }
  