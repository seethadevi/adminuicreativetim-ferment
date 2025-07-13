import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionDashboardComponent } from './subscription-dashboard.component';
import { RouterModule } from '@angular/router';
import { SubscriptionDashboardRoutes } from './subscription-dashboard.routing';
import { MaterialModule } from '../app.module';

@NgModule({
  declarations: [SubscriptionDashboardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(SubscriptionDashboardRoutes)
  ]
})
export class SubscriptionDashboardModule { }
