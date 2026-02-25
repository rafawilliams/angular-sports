import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart-summary',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './cart-summary.component.html',
    styleUrls: ['./cart-summary.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CartSummaryComponent {
    cart = inject(CartService);
}
