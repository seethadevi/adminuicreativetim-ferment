import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';


export const ProductRoutes: Routes = [
    {
      path: '', component: ProductListComponent
    },
    {
      path: 'new', component: ProductFormComponent,
    },
    {
      path: 'update/:id', component: ProductFormComponent,
    }

];
