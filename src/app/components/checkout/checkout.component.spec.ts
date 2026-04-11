import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';

describe('CheckoutComponent', () => {
    let component: CheckoutComponent;
    let fixture: ComponentFixture<CheckoutComponent>;
    let cartService: CartService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CheckoutComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(CheckoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('empty cart state', () => {
        it('should show the empty-cart warning when there are no items', () => {
            fixture.detectChanges();
            const warning = fixture.nativeElement.querySelector('.alert-warning');
            expect(warning).toBeTruthy();
        });

        it('should not render the items table when the cart is empty', () => {
            fixture.detectChanges();
            const table = fixture.nativeElement.querySelector('.checkout-card');
            expect(table).toBeFalsy();
        });

        it('should show a return-to-store link in the empty state', () => {
            fixture.detectChanges();
            const link = fixture.nativeElement.querySelector('a[routerLink="/products"]');
            expect(link).toBeTruthy();
        });
    });

    describe('cart with items', () => {
        beforeEach(() => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            cartService.addProduct('2', 'Tennis Racket', 50);
            fixture.detectChanges();
        });

        it('should hide the empty-cart warning', () => {
            const warning = fixture.nativeElement.querySelector('.alert-warning');
            expect(warning).toBeFalsy();
        });

        it('should render a row for each cart line', () => {
            const rows = fixture.nativeElement.querySelectorAll('.cart-row');
            expect(rows).toHaveLength(2);
        });

        it('should display the product name in each row', () => {
            const rows = fixture.nativeElement.querySelectorAll('.cart-row');
            expect(rows[0].textContent).toContain('Soccer Ball');
            expect(rows[1].textContent).toContain('Tennis Racket');
        });

        it('should show a remove button for each item', () => {
            const removeButtons = fixture.nativeElement.querySelectorAll('.remove-btn');
            expect(removeButtons).toHaveLength(2);
        });

        it('should show a link to proceed to /placeorder', () => {
            const link = fixture.nativeElement.querySelector('a[routerLink="/placeorder"]');
            expect(link).toBeTruthy();
        });
    });

    describe('remove', () => {
        beforeEach(() => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            cartService.addProduct('2', 'Tennis Racket', 50);
        });

        it('should call cartService.removeProduct with the correct id', () => {
            const removeSpy = vi.spyOn(cartService, 'removeProduct');
            component.remove('1');
            expect(removeSpy).toHaveBeenCalledWith('1');
        });

        it('should reduce the number of rendered rows after removal', () => {
            component.remove('1');
            fixture.detectChanges();
            const rows = fixture.nativeElement.querySelectorAll('.cart-row');
            expect(rows).toHaveLength(1);
        });

        it('should show the empty-cart warning after removing all items', () => {
            component.remove('1');
            component.remove('2');
            fixture.detectChanges();
            const warning = fixture.nativeElement.querySelector('.alert-warning');
            expect(warning).toBeTruthy();
        });
    });
});
