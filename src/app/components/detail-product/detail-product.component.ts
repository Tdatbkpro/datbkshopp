import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { CommentResponse } from '../../responses/comment/commet.response'; // Sửa lỗi chính tả commet.response => comment.response
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { CommentDTO } from '../../dtos/comment/comment.dto';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  comments: CommentResponse[] = []; // Khai báo kiểu dữ liệu cho comments

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private tokenService : TokenService
  ) {}

  ngOnInit() {
    // Lấy productId từ URL
    debugger
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    const userId = this.tokenService.getUserId();
    if (idParam !== null) {
      this.productId = +idParam;
    }

    if (!isNaN(this.productId)) {
      this.loadProductDetails();
      if(userId !== 0) {
        debugger
        
        this.getCommentsByUserAndProduct(userId, this.productId);
      }
      else {
        debugger
        
        this.getCommentsByProduct(this.productId);
      }
    } else {
      alert(`Không có productId: ${idParam}`);
    }
  }

  loadProductDetails() {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (response: any) => {
        if (response.product_images && response.product_images.length > 0) {
          response.product_images.forEach((product_image: ProductImage) => {
            product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
          });
        }
        this.product = response;
        this.showImage(0);
      },
      error: (error: any) => {
        alert(`Đã xảy ra lỗi: ${JSON.stringify(error.error)}`);
      }
    });
  }

  showImage(index: number) {
    if (this.product?.product_images && this.product.product_images.length > 0) {
      if (index < 0) index = 0;
      else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnail(index: number) {
    this.currentImageIndex = index;
  }

  previousImage() {
    this.showImage(this.currentImageIndex - 1);
  }

  nextImage() {
    this.showImage(this.currentImageIndex + 1);
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
      alert(`Thêm vào giỏ hàng thành công sản phẩm : ${this.product.name} với số lượng ${this.quantity}`);
    } else {
      alert("Sản phẩm không tồn tại");
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) this.quantity--; // Đảm bảo số lượng không giảm dưới 1
  }

  buyNow() {
    // Logic cho mua ngay
  }

  // comment
  content : string = '';
  user_id : number = 0;

  submitComment(): void {
    debugger
    const commentDTO: CommentDTO = {

      content: this.content,
      user_id : this.tokenService.getUserId(),
      product_id: this.productId,
    };

    this.commentService.insertComment(commentDTO).subscribe({
      next: (response) => {
        debugger
        console.log('Comment inserted successfully:', response);
        window.location.reload();
      
        // Xử lý sau khi chèn thành công, ví dụ: làm trống form hoặc thông báo cho người dùng
      },
      error: (error) => {
        debugger
        console.error('Error inserting comment:', error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      }
    });
  }

  getCommentsByProduct(productId: number): void {
    if (productId) {
      this.commentService.getCommentsByProduct(productId).subscribe({
        next: (comments) => {
          this.comments = comments.map((comment: CommentResponse) => {
            // Kiểm tra kiểu dữ liệu của updatedAt
            if (Array.isArray(comment.updated_at) && comment.updated_at.length === 6) {
              const [year, month, day, hour, minute, second] = comment.updated_at;
  
              // Khởi tạo ngày giờ. Lưu ý: tháng cần trừ 1 vì tháng trong Date bắt đầu từ 0.
              const date = new Date(year, month - 1, day, hour, minute, second);
              
              return {
                ...comment,
                updatedAt: date // Cập nhật thuộc tính updatedAt với đối tượng Date
              };
            } else {
              console.error('Invalid date format:', comment.updated_at);
              return comment;
            }
          });
        },
        error: (err: any) => {
          console.error('Error fetching comments:', err);
        }
      });
    }
  }
  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        debugger
        // Xóa bình luận thành công, cập nhật danh sách bình luận
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        window.location.reload()
      },
      error: (err) => {
        debugger
        console.error('Error deleting comment:', err);
      }
    });
  }
  editComment() {
    alert("Chỉ ADMIN mới được sửa");
  }
  getCommentsByUserAndProduct(userId: number, productId: number): void {
    this.commentService.getCommentsByUserAndProduct(userId, productId).subscribe({
      next: (comments) => {
        debugger
        this.comments = comments.map((comment: CommentResponse) => {
          // Kiểm tra kiểu dữ liệu của updatedAt
          if (Array.isArray(comment.updated_at) && comment.updated_at.length === 6) {
            const [year, month, day, hour, minute, second] = comment.updated_at;

            // Khởi tạo ngày giờ. Lưu ý: tháng cần trừ 1 vì tháng trong Date bắt đầu từ 0.
            const date = new Date(year, month - 1, day, hour, minute, second);
            
            return {
              ...comment,
              updated_at: date // Cập nhật thuộc tính updatedAt với đối tượng Date
            };
          } else {
            console.error('Invalid date format:', comment.updated_at);
            return comment;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
        // Xử lý lỗi tùy theo nhu cầu
      }
    });
  }
}
