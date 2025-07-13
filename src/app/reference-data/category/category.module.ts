import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';



@NgModule({
  declarations: [CategoryComponent, CategoryFormComponent, CategoryListComponent],
  imports: [
    CommonModule
  ]
})
export class CategoryModule { }
