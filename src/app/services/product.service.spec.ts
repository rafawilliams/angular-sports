import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product, Order } from './product.service';

describe('ProductService', () => {
    let service: ProductService;
    let httpMock: HttpTestingController;

    const PRODUCTS_URL = 'http://localhost:4200/products';
    const ORDERS_URL = 'http://localhost:4200/orders';

    const mockProducts: Product[] = [
        { id: '1', name: 'Soccer Ball', description: 'A great ball', category: 'Soccer', price: 20 },
        { id: '2', name: 'Tennis Racket', description: 'Pro racket', category: 'Tennis', price: 50 },
    ];

    const mockOrder: Order = {
        name: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'US',
        giftwrap: false,
        products: [],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ProductService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getProducts', () => {
        it('should perform a GET to the products endpoint', () => {
            service.getProducts().subscribe();
            const req = httpMock.expectOne(PRODUCTS_URL);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('should return the list of products from the API', () => {
            let result: Product[] = [];
            service.getProducts().subscribe((data) => (result = data));

            const req = httpMock.expectOne(PRODUCTS_URL);
            req.flush(mockProducts);

            expect(result).toHaveLength(2);
            expect(result).toEqual(mockProducts);
        });

        it('should propagate HTTP errors to the subscriber', () => {
            let errorStatus = 0;
            service.getProducts().subscribe({
                next: () => {},
                error: (err) => (errorStatus = err.status),
            });

            const req = httpMock.expectOne(PRODUCTS_URL);
            req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

            expect(errorStatus).toBe(500);
        });
    });

    describe('sendOrder', () => {
        it('should perform a POST to the orders endpoint', () => {
            service.sendOrder(mockOrder).subscribe();
            const req = httpMock.expectOne(ORDERS_URL);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('should send the order object as the request body', () => {
            service.sendOrder(mockOrder).subscribe();
            const req = httpMock.expectOne(ORDERS_URL);
            expect(req.request.body).toEqual(mockOrder);
            req.flush({});
        });

        it('should return the server response on success', () => {
            const serverResponse = { id: 'order-123', status: 'confirmed' };
            let result: any;
            service.sendOrder(mockOrder).subscribe((data) => (result = data));

            const req = httpMock.expectOne(ORDERS_URL);
            req.flush(serverResponse);

            expect(result).toEqual(serverResponse);
        });

        it('should propagate HTTP errors to the subscriber', () => {
            let errorStatus = 0;
            service.sendOrder(mockOrder).subscribe({
                next: () => {},
                error: (err) => (errorStatus = err.status),
            });

            const req = httpMock.expectOne(ORDERS_URL);
            req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

            expect(errorStatus).toBe(400);
        });
    });
});
