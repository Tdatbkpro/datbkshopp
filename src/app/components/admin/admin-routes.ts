import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrderAdminComponent } from './order/order.admin.component';
import { DetailOrderAdminComponent } from './detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './product/product.admin.component';
import { UpdateProductAdminComponent } from './product/update/update.product.admin.component';
import { InsertProductAdminComponent } from './product/insert/insert.product.admin.component';
import { UpdateCategoryAdminComponent } from './category/update/update.category.admin.component';
import { InsertCategoryAdminComponent } from './category/insert/insert.category.admin.component';
import { CategoryAdminComponent } from './category/category.admin.component';
// Import các component khác nếu cần

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'orders', component: OrderAdminComponent },
      { path: 'orders/:id', component: DetailOrderAdminComponent },
      {path: 'products' ,component: ProductAdminComponent},
      {
        path: 'products/update/:id',
        component: UpdateProductAdminComponent
    },
    {
      path: 'categories/update/:id',
      component: UpdateCategoryAdminComponent
  },
  {
      path: 'categories/insert',
      component: InsertCategoryAdminComponent
  },
    {
        path: 'products/insert',
        component: InsertProductAdminComponent
    },
    {
      path: 'categories',
      component: CategoryAdminComponent
  },
      // Định nghĩa các route khác cho các component khác nếu cần
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
