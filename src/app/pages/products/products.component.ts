import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  displayedProducts: any[] = [];
  itemsPerPage = 9;
  currentPage = 1;
  totalPages = 1;
  visiblePages: number[] = [];
  sortDirection: 'asc' | 'desc' | 'ratingAsc' | 'ratingDesc' | 'default' =
    'default';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.updateDisplayedProducts();
    });
  }

  setDefaultImage(product: any): void {
    product.image_link =
      'https://www.sgs.com/-/media/sgscorp/images/temporary/sg-15021-cosmetics.cdn.en-AT.1.jpg';
  }

  loadNextPage() {
    this.currentPage++;
    this.updateDisplayedProducts();
  }

  loadPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
    }
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    let unsortedProducts = [...this.products];

    let sortField: string;
    let sortDirection: 'asc' | 'desc' = 'asc';

    if (this.sortDirection === 'asc' || this.sortDirection === 'desc') {
      sortField = 'price';
      sortDirection = this.sortDirection;
    } else if (
      this.sortDirection === 'ratingAsc' ||
      this.sortDirection === 'ratingDesc'
    ) {
      sortField = 'rating';
      sortDirection = this.sortDirection === 'ratingAsc' ? 'asc' : 'desc';
    } else {
      sortField = 'default';
    }

    unsortedProducts = this.sortProducts(
      unsortedProducts,
      sortField,
      sortDirection
    );

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedProducts = unsortedProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
    this.totalPages = Math.ceil(unsortedProducts.length / this.itemsPerPage);

    this.visiblePages = this.getVisiblePages();
  }

  sortProducts(
    products: any[],
    field: string,
    direction: 'asc' | 'desc'
  ): any[] {
    if (field === 'price' || field === 'rating') {
      return direction === 'asc'
        ? products.sort((a, b) => a[field] - b[field])
        : products.sort((a, b) => b[field] - a[field]);
    } else {
      return products;
    }
  }

  getVisiblePages(): number[] {
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  addToCart(product: any): void {
    this.productService.addToCart(product);
  }
}
