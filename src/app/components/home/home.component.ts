import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { environment } from '../../enviroments/environment';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  faStar = faStar;
  faSearch = faSearch;
  categories: Category[] = [];
  products: Product[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  selectedCategoryId: number = 0;
  

  constructor(private router : Router, private productService: ProductService , private categoryService: CategoryService) { }

  ngOnInit() {
    this.getCategories(1,5);
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
  }
  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    this.getProducts(this.keyword , this.selectedCategoryId, this.currentPage, this.itemsPerPage);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
  
      next: (response: any) => {
        //debugger
              this.categories = response.categories;
      },
      error: (error: any) => {
          console.error('Error:', error);
          alert(`Đã xảy ra lỗi: ${JSON.stringify(error.error)}`);
      }
  });          
  }
  getProducts(keyword :string, selectedCategoryId: number, page : number, limit : number) {
    this.productService.getProducts(keyword,selectedCategoryId, page, limit).subscribe({
  
        next: (response: any) => {
            console.log('API response:', response);
                debugger
                if (Array.isArray(response.products)) {
                  response.products.forEach((product: Product) => {
                      product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
                  });
              } else {
                  console.error("response.products is not an array");
              }
                this.products = response.products;
                this.totalPages = response.totalPages// Đảm bảo totalPages không âm
                this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        
        },
        error: (error: any) => {
            console.error('Error:', error);
            alert(`Đã xảy ra lỗi: ${JSON.stringify(error.error)}`);
        }
    });
}


  onPageChange(page: number) {
    this.currentPage = page;
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Đảm bảo startPage và endPage là hợp lệ
    if (startPage < 1) startPage = 1;
    if (endPage > totalPages) endPage = totalPages;

    return new Array(endPage - startPage + 1).fill(0).map((_, index) => startPage + index);
  }
  onProductClick(productId : number) {
    this.router.navigate(['/products', productId]);
  }
}

