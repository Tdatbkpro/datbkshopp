import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable ,throwError, of} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';
import { Order } from '../models/order';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
  private apiGetOrders = `${environment.apiBaseUrl}/orders`;  // Đảm bảo rằng bạn đã khai báo đúng `apiBaseUrl`
  private apiGetAllOrders =`${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  constructor(private http: HttpClient) {}

  placeOrder(orderData: OrderDTO): Observable<any> {    
    // Gửi yêu cầu đặt hàng
    return this.http.post(this.apiGetOrders, orderData);
  }

  getOrderById(orderId : number): Observable<any> {
    return this.http.get(`${this.apiGetOrders}/${orderId}`);
  }
  getAllOrders(keyword :string,  page: number, limit: number)
    : Observable<{ orders: OrderResponse[]}> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('keyword', keyword)
        return this.http.get<any>(this.apiGetAllOrders, { params });
    }
    updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
      const url = `${environment.apiBaseUrl}/orders/${orderId}`;
      return this.http.put(url, orderData);
    }
    getOrdersByUserId(userId : number): Observable<Order[]>{
      return this.http.get<any>(`${this.apiGetOrders}/user/${userId}`);
    }
    deleteOrder(orderId: number): Observable<any> {
      const url = `${environment.apiBaseUrl}/orders/${orderId}`;
      return this.http.delete(url, { responseType: 'text' });
    }
}