import { Routes, RouterModule } from '@angular/router';
import { ProducersubListComponent } from './producersub-list/producersub-list.component';
import { ProducersubFormComponent } from './producersub-form/producersub-form.component';
import { NgModule } from '@angular/core';
export const routes: Routes = [
    {
      path: '', component: ProducersubListComponent,
    },
    {
      path: ':option', component: ProducersubListComponent,
    },
    {
      path: 'producer/new', component: ProducersubFormComponent,
    },
    {
      path: 'update/:id', component: ProducersubFormComponent,
    },
    {
      path: 'pendingupdate/:id', component: ProducersubFormComponent,
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProducersubRoutingModule { }
