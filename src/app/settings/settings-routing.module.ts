import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsFormComponent } from './settings-form/settings-form.component';

const routes: Routes = [
    {
      path: '', component: SettingsFormComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SettingsRoutingModule {}
