import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail, IsNumber, ArrayMinSize, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../models/product';
import { CartItemrDTO } from './cart.item.dto';

export class OrderDTO {

    user_id: number;

    @IsNotEmpty()
    @IsPhoneNumber()
    fullname:string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsString()
    note:string;

    @IsNumber()
    total_money : number;

    @IsString()
    payment_method: string;

    @IsString()
    shipper_method : string;

    @IsString()
    coupon_code : string;

    @IsString()
    province:string;

    @IsString()
    district :string;

    @IsString()
    commune:string

    // @ArrayMinSize(1, {message : 'Yêu cầu phải có ít nhất một sản phẩm trong giỏ hàng'})
    // @ValidateNested({each : true})
    // @Type(() => CartItemrDTO)
    cart_items: {product_id :number, quantity : number}[];

  constructor(data: any) {
    this.note = data.note;
    this.phone_number = data.phone_number;
    this.fullname = data.fullname;
    this.user_id = data.user_id;
    this.address = data.address;
    this.district = data.district;
    this.commune = data.commune;
    this.province = data.province;
    this.email = data.email
    this.payment_method = data.payment_method
    this.total_money = data.total_money
    this.coupon_code = data.coupon_code
    this.cart_items = data.shipper_method
    this.shipper_method = data.shipper_method
  }
}
