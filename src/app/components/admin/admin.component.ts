import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { OrderAdminComponent } from './order/order.admin.component';
import { DetailOrderAdminComponent } from './detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './product/product.admin.component';
import { UpdateProductAdminComponent } from './product/update/update.product.admin.component';
import { InsertProductAdminComponent } from './product/insert/insert.product.admin.component';
import { UpdateCategoryAdminComponent } from './category/update/update.category.admin.component';
import { InsertCategoryAdminComponent } from './category/insert/insert.category.admin.component';
import { CategoryAdminComponent } from './category/category.admin.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,OrderAdminComponent , 
    DetailOrderAdminComponent , ProductAdminComponent
  ,UpdateProductAdminComponent, InsertProductAdminComponent,
  UpdateCategoryAdminComponent, InsertCategoryAdminComponent,CategoryAdminComponent] // Khai báo các module cần thiết
})
export class AdminComponent implements OnInit {
  userResponse?: UserResponse | null;
  adminComponent: string = 'orders';

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userResponse = this.userService.getUserFromLocalStorage();
    if (this.router.url === '/admin') {
      this.router.navigate(['/admin/orders']);
    }
  }

  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserFromLocalStorage();
    this.router.navigate(['/']);
  }
  home() {
    this.router.navigate(['/']);
  }

  showAdminComponent(componentName: string): void {
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    }
  }
  
}
