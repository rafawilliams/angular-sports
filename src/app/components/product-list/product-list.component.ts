import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private cartService = inject(CartService);

    products: Product[] = [];
    categories: string[] = [];
    selectedCategory: string | null = null;
    error: any = null;

    ngOnInit() {
        this.productService.getProducts().subscribe({
            next: (data) => {
                this.products = data;
                const allCategories = data.map(p => p.category);
                this.categories = Array.from(new Set(allCategories)).sort();
            },
            error: (err) => this.error = err
        });
    }

    get filteredProducts(): Product[] {
        if (!this.selectedCategory) return this.products;
        return this.products.filter(p => p.category === this.selectedCategory);
    }

    selectCategory(newCategory: string | null) {
        this.selectedCategory = newCategory;
    }

    addProductToCart(product: Product) {
        this.cartService.addProduct(product.id, product.name, product.price);
    }
}
