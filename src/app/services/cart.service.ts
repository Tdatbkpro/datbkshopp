import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from './product.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cart: Map<number, number> = new Map();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private productService: ProductService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.refreshCart();
        }
    }
    
    addToCart(productId: number, quantity: number = 1) {
        if (isPlatformBrowser(this.platformId)) {
            if (this.cart.has(productId)) {
                this.cart.set(productId, this.cart.get(productId)! + quantity);
            } else {
                this.cart.set(productId, quantity);
            }
            this.saveCartToLocalStorage();
        }
    }

    setCart(cart: Map<number, number>) {
        if (isPlatformBrowser(this.platformId)) {
            this.cart = cart ?? new Map<number, number>();
            this.saveCartToLocalStorage();
        }
    }

    getCart(): Map<number, number> {
        return this.cart;
    }

    saveCartToLocalStorage() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
        }
    }

    clearCart() {
        if (isPlatformBrowser(this.platformId)) {
            this.cart.clear();
            this.saveCartToLocalStorage();
        }
    }

    refreshCart() {
        if (isPlatformBrowser(this.platformId)) {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                this.cart = new Map(JSON.parse(storedCart));
                console.log('Cart refreshed:', this.cart);
            } else {
                this.cart = new Map<number, number>();
            }
        }
    }
}
