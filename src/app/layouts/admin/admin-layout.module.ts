import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout.component';
import { SidebarModule } from 'src/app/sidebar/sidebar.module';
import { NavbarModule } from 'src/app/shared/navbar/navbar.module';
import { FooterModule } from 'src/app/shared/footer/footer.module';
import { FixedpluginModule } from 'src/app/shared/fixedplugin/fixedplugin.module';
 import { PageLoadingModule } from '../../shared/modules';

@NgModule({
  imports: [
    CommonModule,
    // PageLoadingModule
  ],
  declarations: [
  //  AdminLayoutComponent
  ]
})
export class AdminLayoutModule { }
