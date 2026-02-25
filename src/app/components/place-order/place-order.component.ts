import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Order } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-place-order',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './place-order.component.html'
})
export class PlaceOrderComponent {
    order: Order = { name: '', street: '', city: '', state: '', zip: '', country: '', giftwrap: false, products: [] };
    submitted = false;
    orderError: any = null;

    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private router = inject(Router);

    sendOrder() {
        this.submitted = true;
        this.orderError = null;
        this.order.products = this.cartService.products();

        this.productService.sendOrder(this.order).subscribe({
            next: (data) => {
                this.cartService.clear();
                this.router.navigateByUrl('/complete');
            },
            error: (err) => {
                this.orderError = err;
                this.submitted = false;
            }
        });
    }
}
