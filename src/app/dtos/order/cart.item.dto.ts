import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';
import { Product } from '../../models/product';

export class CartItemrDTO {
    product_id: number;

    quantity: number;
 

  constructor(data: any) {
    this.product_id = data.product_id;
    this.quantity = data.quantity;
  }
}
