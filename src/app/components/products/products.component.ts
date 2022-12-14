import { Component, OnInit } from '@angular/core';
import { Product } from './../../models/product.model';

import { ValueService } from './../../services/value.service';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  limit = 10;
  offset = 0;
  status: 'init' | 'loading' | 'success' | 'error' = 'init';

  response = '';

  constructor(
    private valueService: ValueService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productService.getAll(this.limit, this.offset)
      .subscribe({
        next: products => {
          this.status = 'success';
          this.offset += this.limit;
          this.products = this.products.concat(products);
        },
        error: e => {
          setTimeout(() => { this.status = 'error'; }, 1000);
        }
      });
  }

  async callPromise() {
    const res = await this.valueService.getPromiseValue();
    this.response = res;
  }

}
