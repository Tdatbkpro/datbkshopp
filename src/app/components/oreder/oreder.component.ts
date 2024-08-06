import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Validator } from 'class-validator';
import { AddressService } from '../../services/address.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CouponService } from '../../services/coupon.service';

@Component({
  selector: 'app-oreder',
  templateUrl: './oreder.component.html',
  styleUrl: './oreder.component.scss'
})
export class OrederComponent implements OnInit{
  cartItems : {product: Product, quantity : number}[] = [];
  couponCode : string = '';
  totalAmount : number = 0;
  couponDiscount: number = 0; //số tiền được discount từ coupon
  couponApplied: boolean = false;
  cart: Map<number, number> = new Map();
  orderForm : FormGroup;
  orderData: OrderDTO = {
    user_id : 0,
    fullname: '',
    province:'',
    district :'',
    commune:'',
    email: '',
    phone_number: '',
    address: '',
    note : '',
    total_money : 0,
    payment_method: 'cod',
    shipper_method :  'express',
    coupon_code : '',
    cart_items:  []
  }
  
  constructor(
    private cartService : CartService,
    private productService : ProductService,
    private orderService: OrderService,
    private fb : FormBuilder,
    private tokenService: TokenService,
    private addressService: AddressService,
    private router : Router,
    private couponService : CouponService
  ){
    this.provinces$ = this.addressService.provinces$;
    this.districts$ = new Observable<any[]>();
    this.communes$ = new Observable<any[]>();
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]],
      province: ['', Validators.required],
      district: ['', [Validators.required, Validators.minLength(5)]],
      commune: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }
  placeOrder() {
  
    if(this.orderForm.errors === null) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      }
      debugger
      this.orderData.total_money = this.totalAmount;
      this.orderData.cart_items = this.cartItems.map(cartItem =>
        ({product_id: cartItem.product.id,quantity: cartItem.quantity} )
      )
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          debugger
          alert("Đặt hàng thành công")
          this.cartService.clearCart();
          this.router.navigate(['/orders/',response.id ]);
        },
        complete: () => {
  
        },
        error: (err : any) => {
          
          alert("Đặt hàng thất bại");
        }
      })
    }
    else {
      alert("Dữ liệu nhập vào không hợp lệ. Hãy nhập lại")
    }
  }
  ngOnInit(): void {  
    debugger
    //this.cartService.clearCart();
    this.orderData.user_id = this.tokenService.getUserId();    
    // Lấy danh sách sản phẩm từ giỏ hàng
    debugger
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    debugger    
    if(productIds.length === 0) {
      return;
    }    
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {            
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }          
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });        
  }

    caculateTotal() {
      this.totalAmount = this.cartItems.reduce(
        (total, item) => total + item.product.price *item.quantity,
        0
      )
    }
    applyCoupon() {
      const couponCode = this.orderForm.get('couponCode')!.value;
      debugger
    if (!this.couponApplied && couponCode) {
      debugger
      this.calculateTotal();
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (response) => {
            alert("Mã hợp lệ")
            this.couponDiscount = this.totalAmount - response.result;
            this.totalAmount = response.result;
            this.couponApplied = true;
          }
        });
    }
    else {
      alert("Mã không hợp lệ")
    }

    }

    // lay api dia chi viet nam
    provinces$: Observable<any[]>;
  districts$: Observable<any[]>;
  communes$: Observable<any[]>;

  selectedProvince: string = '';
  selectedDistrict: string = '';
  onProvinceChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const provinceId = target.value;

    if (provinceId) {
      this.districts$ = this.addressService.getDistricts(provinceId);
      this.selectedProvince = provinceId;
      this.selectedDistrict = '';
      this.communes$ = new Observable<any[]>();
      console.log(this.districts$)
      this.orderForm.get('district')!.setValue('');
      this.orderForm.get('commune')!.setValue('');
      this.orderForm.get('province')?.setValue(this.addressService.getProvinceName(provinceId));
    } else {
      this.districts$ = new Observable<any[]>();
      this.communes$ = new Observable<any[]>();
    }
  }

  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const districtId = target.value;

    if (districtId) {
      this.communes$ = this.addressService.getCommunes(districtId);
      this.selectedDistrict = districtId;
      this.orderForm.get('commune')!.setValue('');
      this.orderForm.get('district')?.setValue(this.addressService.getDistrictName(districtId));
    } else {
      this.communes$ = new Observable<any[]>();
    }
  }
  onCommuneChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const communeId = target.value;

    if (communeId) {
      this.orderForm.get('commune')?.setValue(this.addressService.getCommuneName(communeId));
    } 
  }
  onBuy(orderId : number) {
    this.router.navigate(['/orders', orderId])
  } 
  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }
  
  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;   
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
  }    
  
  // Hàm tính tổng tiền
  calculateTotal(): void {
      this.totalAmount = this.cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
      );
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

}
