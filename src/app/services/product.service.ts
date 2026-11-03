import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { CartLine } from './cart.service';

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
}

export interface Order {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    giftwrap: boolean;
    products: CartLine[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);

    private dataUrl = 'http://localhost:4200/products';
    private orderUrl = 'http://localhost:4200/orders';

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.dataUrl);
    }

    sendOrder(order: Order): Observable<unknown> {
        return this.http.post<unknown>(this.orderUrl, order);
    }
}
