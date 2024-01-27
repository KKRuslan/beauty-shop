import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'assets/db.json';
  private cartProducts: any[] = [];
  private cartOpenSubject = new Subject<boolean>();

  cartOpen$ = this.cartOpenSubject.asObservable();
  constructor(private http: HttpClient) {
    const storedCartProducts = localStorage.getItem('cartProducts');
    if (storedCartProducts) {
      this.cartProducts = JSON.parse(storedCartProducts);
    }
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCartProducts(): any[] {
    return this.cartProducts;
  }

  addToCart(product: any): void {
    const existingProduct = this.cartProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      const newProduct = {
        ...existingProduct,
        quantity: existingProduct.quantity + 1,
      };
      this.cartProducts.push(newProduct);
    } else {
      this.cartProducts.push({ ...product, quantity: 1 });
    }

    this.cartOpenSubject.next(true);
    this.saveCartToLocalStorage();
  }

  removeFromCart(product: any): void {
    const existingProductIndex = this.cartProducts.findIndex(
      (p) => p.id === product.id
    );
    if (existingProductIndex !== -1) {
      const existingProduct = this.cartProducts[existingProductIndex];
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.cartProducts.splice(existingProductIndex, 1);
      }
    }
    if (this.cartProducts.length === 0) {
      this.cartOpenSubject.next(false);
    }
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }
}
