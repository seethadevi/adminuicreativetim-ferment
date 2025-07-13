import { Routes } from '@angular/router';



export const ReferenceDataRoutes: Routes = [
  {
    path: 'product',
    loadChildren: './product/product.module#ProductModule'
  }, {
    path: 'winery',
    loadChildren: './winery/winery.module#WineryModule'
  }, {
    path: 'taxclass',
    loadChildren: './taxclass/taxclass.module#TaxclassModule'
  }, {
    path: 'dynamicform',
    loadChildren: './dynamic-form/dynamic-form.module#DynamicFormModule'
  }, {
    path: 'customer',
    loadChildren: './customers/customers.module#CustomersModule'
  }, {
    path: 'vineyard',
    loadChildren: './vineyard/vineyard.module#VineyardModule'
  }, {
    path: 'vendor',
    loadChildren: './vendor/vendor.module#VendorModule'
  }, {
    path: 'centralwarehouse',
    loadChildren: './centralwarehouse/centralwarehouse.module#CentralwarehouseModule'
  }, {
    path: 'reflocation',
    loadChildren: './location/location.module#LocationModule'
  }, {
    path: 'bannerpromotion',
    loadChildren: './banner-promotion/banner-promotion.module#BannerPromotionModule'
  }, {
    path: 'appemailtemplate',
    loadChildren: './email-template/email-template.module#EmailTemplateModule'
  }, {
    path: 'approvals',
    loadChildren: './approvals/approvals.module#ApprovalsModule'
  }
];
