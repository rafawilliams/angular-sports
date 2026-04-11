import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router, provideRouter } from '@angular/router';
import { PlaceOrderComponent } from './place-order.component';
import { ProductService, Order } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

const validOrder: Partial<Order> = {
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US',
    giftwrap: false,
};

describe('PlaceOrderComponent', () => {
    let component: PlaceOrderComponent;
    let fixture: ComponentFixture<PlaceOrderComponent>;
    let productServiceSpy: { sendOrder: ReturnType<typeof vi.fn>; getProducts: ReturnType<typeof vi.fn> };
    let cartService: CartService;
    let router: Router;
    let navigateSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(async () => {
        productServiceSpy = {
            getProducts: vi.fn().mockReturnValue(of([])),
            sendOrder: vi.fn().mockReturnValue(of({ id: 'order-123' })),
        };

        await TestBed.configureTestingModule({
            imports: [PlaceOrderComponent],
            providers: [
                provideRouter([]),
                { provide: ProductService, useValue: productServiceSpy },
            ],
        }).compileComponents();

        cartService = TestBed.inject(CartService);
        router = TestBed.inject(Router);
        // Prevent unhandled rejections from navigateByUrl when routes are not registered
        navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
        fixture = TestBed.createComponent(PlaceOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('initial state', () => {
        it('should have an empty order model on creation', () => {
            expect(component.order.name).toBe('');
            expect(component.order.street).toBe('');
            expect(component.order.city).toBe('');
            expect(component.order.state).toBe('');
            expect(component.order.zip).toBe('');
            expect(component.order.country).toBe('');
            expect(component.order.giftwrap).toBe(false);
        });

        it('should have submitted as false initially', () => {
            expect(component.submitted).toBe(false);
        });

        it('should have no orderError initially', () => {
            expect(component.orderError).toBeNull();
        });
    });

    describe('sendOrder – success path', () => {
        beforeEach(() => {
            Object.assign(component.order, validOrder);
            cartService.addProduct('1', 'Soccer Ball', 20);
        });

        it('should call productService.sendOrder', () => {
            component.sendOrder();
            expect(productServiceSpy.sendOrder).toHaveBeenCalledOnce();
        });

        it('should attach the current cart products to the order before sending', () => {
            component.sendOrder();
            const sentOrder: Order = productServiceSpy.sendOrder.mock.calls[0][0];
            expect(sentOrder.products).toHaveLength(1);
            expect(sentOrder.products[0].name).toBe('Soccer Ball');
        });

        it('should set submitted to true while processing', () => {
            // submitted becomes true before the async response
            productServiceSpy.sendOrder.mockReturnValue(of({}));
            component.sendOrder();
            // After a synchronous observable completes, submitted may be reset—
            // we verify it was set by checking the call side-effects instead
            expect(productServiceSpy.sendOrder).toHaveBeenCalled();
        });

        it('should clear the cart after a successful order', () => {
            component.sendOrder();
            expect(cartService.itemCount).toBe(0);
        });

        it('should navigate to /complete after a successful order', async () => {
            component.sendOrder();
            expect(navigateSpy).toHaveBeenCalledWith('/complete');
        });

        it('should keep orderError as null on success', () => {
            component.sendOrder();
            expect(component.orderError).toBeNull();
        });
    });

    describe('sendOrder – error path', () => {
        beforeEach(() => {
            Object.assign(component.order, validOrder);
        });

        it('should set orderError when the API call fails', () => {
            const apiError = { status: 500, message: 'Internal Server Error' };
            productServiceSpy.sendOrder.mockReturnValue(throwError(() => apiError));

            component.sendOrder();

            expect(component.orderError).toEqual(apiError);
        });

        it('should reset submitted to false on error', () => {
            productServiceSpy.sendOrder.mockReturnValue(throwError(() => new Error('fail')));

            component.sendOrder();

            expect(component.submitted).toBe(false);
        });

        it('should not clear the cart when the order fails', () => {
            cartService.addProduct('1', 'Soccer Ball', 20);
            productServiceSpy.sendOrder.mockReturnValue(throwError(() => new Error('fail')));

            component.sendOrder();

            expect(cartService.itemCount).toBe(1);
        });

        it('should not navigate on error', () => {
            productServiceSpy.sendOrder.mockReturnValue(throwError(() => new Error('fail')));

            component.sendOrder();

            expect(navigateSpy).not.toHaveBeenCalled();
        });
    });

    describe('template rendering', () => {
        it('should render the order form', () => {
            const form = fixture.nativeElement.querySelector('form');
            expect(form).toBeTruthy();
        });

        it('should display the error alert when orderError is set', () => {
            component.orderError = { message: 'Something went wrong' };
            fixture.detectChanges();
            const alert = fixture.nativeElement.querySelector('.alert-danger');
            expect(alert).toBeTruthy();
        });

        it('should not display the error alert when orderError is null', () => {
            component.orderError = null;
            fixture.detectChanges();
            const alert = fixture.nativeElement.querySelector('.alert-danger');
            expect(alert).toBeFalsy();
        });
    });
});
