import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartSummaryComponent } from './cart-summary.component';
import { CartService } from '../../services/cart.service';

describe('CartSummaryComponent', () => {
    let component: CartSummaryComponent;
    let fixture: ComponentFixture<CartSummaryComponent>;
    let cartService: CartService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CartSummaryComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(CartSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should inject the CartService', () => {
        expect(component.cart).toBeTruthy();
    });

    describe('item count badge', () => {
        it('should display 0 when the cart is empty', () => {
            fixture.detectChanges();
            const badge = fixture.nativeElement.querySelector('.badge');
            expect(badge?.textContent?.trim()).toBe('0');
        });

        it('should update to 1 after adding one product', () => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            fixture.detectChanges();
            const badge = fixture.nativeElement.querySelector('.badge');
            expect(badge?.textContent?.trim()).toBe('1');
        });

        it('should reflect the total item quantity across multiple additions', () => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            cartService.addProduct('1', 'Soccer Ball', 20); // count = 2
            cartService.addProduct('2', 'Tennis Racket', 50);
            fixture.detectChanges();
            const badge = fixture.nativeElement.querySelector('.badge');
            expect(badge?.textContent?.trim()).toBe('3');
        });

        it('should reset to 0 after the cart is cleared', () => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            cartService.clear();
            fixture.detectChanges();
            const badge = fixture.nativeElement.querySelector('.badge');
            expect(badge?.textContent?.trim()).toBe('0');
        });
    });

    describe('checkout link', () => {
        it('should render a link that navigates to /checkout', () => {
            const link = fixture.nativeElement.querySelector('a[routerLink="/checkout"]');
            expect(link).toBeTruthy();
        });
    });
});
