import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartProducts: any[] = [];

  constructor(
    public modalRef: MdbModalRef<CartComponent>,
    private productService: ProductService
  ) {
    this.cartProducts = this.productService.getCartProducts();
  }

  close(): void {
    const closeMessage = 'Modal closed';
    this.modalRef.close(closeMessage);
  }

  removeFromCart(product: any): void {
    this.productService.removeFromCart(product);

    this.cartProducts = this.productService.getCartProducts();
  }
}
