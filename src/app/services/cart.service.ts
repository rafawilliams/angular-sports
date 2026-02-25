import { Injectable, signal } from '@angular/core';

export interface CartLine {
    id: string;
    name: string;
    price: number;
    count: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartData = signal<CartLine[]>([]);

    readonly products = this.cartData.asReadonly();

    addProduct(id: string, name: string, price: number): void {
        const current = this.cartData();
        const existing = current.find(item => item.id === id);

        if (existing) {
            existing.count++;
            // Signal mutation triggers implicitly if using mutate but Angular 17+ uses set/update
            this.cartData.set([...current]);
        } else {
            this.cartData.update(items => [...items, { id, name, price, count: 1 }]);
        }
    }

    removeProduct(id: string): void {
        this.cartData.update(items => items.filter(item => item.id !== id));
    }

    clear(): void {
        this.cartData.set([]);
    }

    get totalAmount(): number {
        return this.products().reduce((total, item) => total + (item.price * item.count), 0);
    }

    get itemCount(): number {
        return this.products().reduce((total, item) => total + item.count, 0);
    }
}
