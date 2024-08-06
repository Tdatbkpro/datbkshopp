import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-user',
  templateUrl: './order.user.component.html',
  styleUrls: ['./order.user.component.scss']
})
export class OrderUserComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.getOrderByUserId();
  }

  getOrderByUserId(): void {
    debugger
    const userId = this.tokenService.getUserId();
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (response: Order[]) => {
        debugger
        this.orders = response
        this.orders = response.map(order => {
          order.orderDetailResponses = order.orderDetailResponses.map(detail => {
            detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${detail.product.thumbnail}`;
            return detail;
          });
          return order;
        });
      },
      error: (err: any) => {
        alert(`Lỗi : ${JSON.stringify(err.error)}`);
      }
    });
  }
}
