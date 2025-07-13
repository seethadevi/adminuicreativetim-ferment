import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ChoosesubscriptionComponent } from './choosesubscription.component';
import { ChoosesubscriptionRoutes } from './choosesubscription.routing';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';
import { ImageUploadModule } from '../shared/modules';
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ChoosesubscriptionRoutes),
        FormsModule,
        ImageUploadModule,
        MaterialModule,
        NgxInfiniteScrollerModule,
        InfiniteScrollModule
    ],
    declarations: [ChoosesubscriptionComponent, SubscriptionFormComponent]
})

export class ChoosesubscriptionModule {}
