import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    products: any[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private dataUrl = 'http://localhost:4200/products';
    private orderUrl = 'http://localhost:4200/orders';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.dataUrl);
    }

    sendOrder(order: Order): Observable<any> {
        return this.http.post<any>(this.orderUrl, order);
    }
}
