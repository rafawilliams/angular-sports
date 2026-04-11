import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
    let service: CartService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CartService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('addProduct', () => {
        it('should add a new product to an empty cart', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            expect(service.products()).toHaveLength(1);
            expect(service.products()[0]).toEqual({ id: '1', name: 'Soccer Ball', price: 20, count: 1 });
        });

        it('should increment count when adding an existing product', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('1', 'Soccer Ball', 20);
            expect(service.products()).toHaveLength(1);
            expect(service.products()[0].count).toBe(2);
        });

        it('should keep separate entries for different products', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('2', 'Tennis Racket', 50);
            expect(service.products()).toHaveLength(2);
        });

        it('should not confuse products with similar names but different ids', () => {
            service.addProduct('1', 'Ball', 10);
            service.addProduct('2', 'Ball', 10);
            expect(service.products()).toHaveLength(2);
        });
    });

    describe('removeProduct', () => {
        it('should remove a product by id', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('2', 'Tennis Racket', 50);
            service.removeProduct('1');
            expect(service.products()).toHaveLength(1);
            expect(service.products()[0].id).toBe('2');
        });

        it('should do nothing when removing a non-existent id', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.removeProduct('99');
            expect(service.products()).toHaveLength(1);
        });

        it('should result in an empty cart when the last item is removed', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.removeProduct('1');
            expect(service.products()).toHaveLength(0);
        });
    });

    describe('clear', () => {
        it('should empty a cart with multiple items', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('2', 'Tennis Racket', 50);
            service.clear();
            expect(service.products()).toHaveLength(0);
        });

        it('should work on an already-empty cart without error', () => {
            expect(() => service.clear()).not.toThrow();
            expect(service.products()).toHaveLength(0);
        });
    });

    describe('totalAmount', () => {
        it('should return 0 for an empty cart', () => {
            expect(service.totalAmount).toBe(0);
        });

        it('should return the price of a single product with count 1', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            expect(service.totalAmount).toBe(20);
        });

        it('should multiply price by count for repeated products', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('1', 'Soccer Ball', 20); // count becomes 2
            expect(service.totalAmount).toBe(40);
        });

        it('should sum totals across multiple distinct products', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('1', 'Soccer Ball', 20); // count = 2, subtotal = 40
            service.addProduct('2', 'Tennis Racket', 50); // subtotal = 50
            expect(service.totalAmount).toBe(90);
        });

        it('should decrease when a product is removed', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('2', 'Tennis Racket', 50);
            service.removeProduct('2');
            expect(service.totalAmount).toBe(20);
        });
    });

    describe('itemCount', () => {
        it('should return 0 for an empty cart', () => {
            expect(service.itemCount).toBe(0);
        });

        it('should return 1 after adding a single product', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            expect(service.itemCount).toBe(1);
        });

        it('should reflect quantity increments', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('1', 'Soccer Ball', 20); // count = 2
            service.addProduct('2', 'Tennis Racket', 50); // count = 1
            expect(service.itemCount).toBe(3);
        });

        it('should decrease after a product is removed', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.addProduct('2', 'Tennis Racket', 50);
            service.removeProduct('1');
            expect(service.itemCount).toBe(1);
        });

        it('should return 0 after clear', () => {
            service.addProduct('1', 'Soccer Ball', 20);
            service.clear();
            expect(service.itemCount).toBe(0);
        });
    });
});
