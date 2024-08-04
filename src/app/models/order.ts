import {OrderDetail} from './order.detail'
export interface Order {
    id: number;
    user_id: number;
    fullName: string; 
    email: string;
    province : string;
    district: string;
    commune : string;
    phoneNumber: string; 
    address: string;
    note: string;
    orderDate: string; 
    status: string;
    totalMoney: number; 
    shippingMethod: string; 
    shippingAddress: string; 
    shippingDate: Date; 
    trackingNumber: string; 
    paymentMethod: string; 
    active: boolean;
    orderDetailResponses: OrderDetail[]; 
  }  
