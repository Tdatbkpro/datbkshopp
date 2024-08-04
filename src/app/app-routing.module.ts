import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrederComponent } from './components/oreder/oreder.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { OrderUserComponent } from './components/order.user/order.user.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'orders', component: OrederComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/user', component: OrderUserComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/status', component: OrderStatusComponent, canActivate: [AuthGuardFn] },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuardFn]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
