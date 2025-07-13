import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import {
//   MatAutocompleteModule,
//   MatButtonModule,
//   MatButtonToggleModule,
//   MatCardModule,
//   MatCheckboxModule,
//   MatChipsModule,
//   MatDialogModule,
//   MatExpansionModule,
//   MatGridListModule,
//   MatIconModule,
//   MatInputModule,
//   MatListModule,
//   MatMenuModule,
//   MatNativeDateModule,
//   MatPaginatorModule,
//   MatProgressBarModule,
//   MatProgressSpinnerModule,
//   MatRadioModule,
//   MatRippleModule,
//   MatSelectModule,
//   MatSidenavModule,
//   MatSliderModule,
//   MatSlideToggleModule,
//   MatSnackBarModule,
//   MatSortModule,
//   MatTableModule,
//   MatTabsModule,
//   MatToolbarModule,
//   MatTooltipModule,
//   MatStepperModule,
// } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedpluginModule} from './shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AppRoutes } from './app.routing';
import { AuthGuard } from './shared/guard/auth.guard';
import { AppService } from './shared/services/app.service';
import { CommunicationService } from './shared/services/communication.service';
import { Urls } from './shared/structures/urls';
import { StoreModule } from '@ngrx/store';
import { rootReducer } from './store/store';
import { HttpClientModule } from '@angular/common/http';
import { AppToastrService } from './shared/services/app-toastr.service';
import { ToastrModule } from 'ngx-toastr';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './effects/app-effects';

import { ShopService } from './shop/shop.service';
import { QRCodeModule } from 'angularx-qrcode';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { DragulaModule } from 'ng2-dragula';
import { ProductService } from './reference-data/product/ProductService';
import { WinesService } from './wines/WinesService';
import { WineryService } from './reference-data/winery/winery.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserModule } from '@angular/platform-browser';
import { TaxclassService } from './reference-data/taxclass/taxclass.service';
import { CustomersService } from './reference-data/customers/customers.service';
import { NavBarService } from './shared/navbar/navbar.service';
import { SubscriptionService } from './choosesubscription/subscription.service';
import { VendorService } from './reference-data/vendor/vendor.service';
import { SettingsService } from './settings/settings.service';
import { ChannelService } from './channel/channel.service';
import { LocationService } from './reference-data/location/location.service';
import { BannerPromotionService } from './reference-data/banner-promotion/banner-promotion.service';
import { NotificationService } from './notification/notification.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShopTariffService } from './shop/shop-tariff.service';
import { PageLoadingModule } from './shared/modules/page-loading/page-loading.module';
import { ProducersubService } from './producersub/producersub.service';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatRippleModule,
    DragDropModule
  ],
  declarations: []
})
export class MaterialModule {}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, {
          useHash: true
        }),
        HttpClientModule,
        SidebarModule,
        PageLoadingModule,
        NavbarModule,
        FooterModule,
        FixedpluginModule,
        MaterialModule,
        StoreModule.forRoot({ appMainStore: rootReducer }),
        EffectsModule.forRoot([AppEffects]),
        ToastrModule.forRoot({
          timeOut: 5000,
          preventDuplicates: true,
          newestOnTop: true
        }), // ToastrModule added
        QRCodeModule,
        NgbModule,
        DragulaModule.forRoot(),
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyBCt5J_n2FQlIDSho6bmOa3KlagIhaVueU',
          libraries: ['geometry', 'places'],
          protocol: 3
        }),
        SweetAlert2Module.forRoot({
        }),
        DeviceDetectorModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent
    ],
    providers: [
      AuthGuard,
      AppService, AppToastrService, VendorService, NotificationService, ShopTariffService,
      CommunicationService, SubscriptionService, BannerPromotionService,
      ShopService, ProductService, WinesService, LocationService,
      WineryService, TaxclassService, CustomersService, ProducersubService,
      Urls, NavBarService, SettingsService, ChannelService
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
