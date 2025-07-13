import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EmailTemplateFormComponent } from './email-template-form/email-template-form.component';
import { EmailTemplateListComponent } from './email-template-list/email-template-list.component';

const routes: Routes = [
  {
    path: 'new', component: EmailTemplateFormComponent,
  },
  {
    path: '', component: EmailTemplateListComponent,
  },
  {
    path: 'update/:id', component: EmailTemplateFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class EmailTemplateRoutingModule {}
