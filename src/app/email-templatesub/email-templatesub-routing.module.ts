import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EmailTemplatesubFormComponent } from './email-templatesub-form/email-templatesub-form.component';
import { EmailTemplatesubListComponent } from './email-templatesub-list/email-templatesub-list.component';

const routes: Routes = [
  {
    path: 'new', component: EmailTemplatesubFormComponent,
  },
  {
    path: '', component: EmailTemplatesubListComponent,
  },
  {
    path: 'update/:id', component: EmailTemplatesubFormComponent,
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class EmailTemplatesubRoutingModule {}
