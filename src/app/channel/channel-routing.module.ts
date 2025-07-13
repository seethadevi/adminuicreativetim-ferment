import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChannelFormComponent } from './channel-form/channel-form.component';
import { ChannelListComponent } from './channel-list/channel-list.component';

const routes: Routes = [
  {
    path: '', component: ChannelListComponent,
  },
  {
    path: 'new', component: ChannelFormComponent,
  },
  {
    path: 'update/:id', component: ChannelFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ChannelRoutingModule {}
