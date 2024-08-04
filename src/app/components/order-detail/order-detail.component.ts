import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../enviroments/environment';
import { DetailProductComponent } from '../detail-product/detail-product.component';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderDetail } from '../../models/order.detail';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    province : '',
    district: '',
    commune : '',
    email: '',
    address: '',
    note: '',
    order_date: '',
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [] // Một mảng rỗng
  };  
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails(): void {
    debugger
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {         
        debugger;       
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.district = response.district;
        this.orderResponse.province = response.province;
        this.orderResponse.commune = response.commune;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address; 
        this.orderResponse.note = response.note;
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
        this.orderResponse.order_date = response.order_date
        this.orderResponse.order_details = response.order_details
          .map((order_detail: OrderDetail) => {
          order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
          return order_detail;
        });        
        this.orderResponse.shipping_date = new Date(
          response.shipping_date[0], 
          response.shipping_date[1] + 2, 
          response.shipping_date[2]
        );
      },
      complete: () => {
        debugger;        
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });
  }
}
