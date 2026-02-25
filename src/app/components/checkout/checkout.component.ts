import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
    cart = inject(CartService);

    remove(id: string) {
        this.cart.removeProduct(id);
    }
}
