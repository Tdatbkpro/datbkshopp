import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { Product } from '../models/product';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiGetProducts = `${environment.apiBaseUrl}/products`;

    constructor(private http: HttpClient) {}

    getProducts(keyword :string, selectedCategory: number, page: number, limit: number)
    : Observable<{ products: Product[], totalPages: number }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString())
            .set('keyword', keyword)
            .set('category_id' , selectedCategory);

        return this.http.get<{ products: Product[], totalPages: number }>(this.apiGetProducts, { params });
    }

    getDetailProduct(productId: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiGetProducts}/${productId}`);
      }

    getProductsByIds(productIds : number[]): Observable<Product[]> {
        const params = new HttpParams().set('ids', productIds.join(','));
        return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, {params});
    }
    deleteProduct(productId : number): Observable<Product> {
        return this.http.delete<any>(`${this.apiGetProducts}/${productId}`)
    }
    createProduct(productDTO : InsertProductDTO): Observable<any> {
        return this.http.post<any>(this.apiGetProducts, productDTO)
    }
    uploadImages(productId : number , files : File[]): Observable<any> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
          }
        return this.http.post<any>(`${this.apiGetProducts}/uploads/${productId}`, formData);
    }
    deleteProductImage(id: number): Observable<any> {
        debugger
        return this.http.delete<string>(`${environment.apiBaseUrl}/product_images/${id}`);
      }
      
      updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
        return this.http.put<Product>(`${this.apiGetProducts}/${productId}`, updatedProduct);
      }  

}

