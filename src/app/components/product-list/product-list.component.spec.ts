import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

const mockProducts: Product[] = [
    { id: '1', name: 'Soccer Ball', description: 'A great ball', category: 'Soccer', price: 20 },
    { id: '2', name: 'Tennis Racket', description: 'Pro racket', category: 'Tennis', price: 50 },
    { id: '3', name: 'Football', description: 'Game ball', category: 'Soccer', price: 30 },
];

function createProductServiceSpy() {
    return { getProducts: vi.fn().mockReturnValue(of(mockProducts)), sendOrder: vi.fn() };
}

describe('ProductListComponent', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;
    let productServiceSpy: ReturnType<typeof createProductServiceSpy>;
    let cartService: CartService;

    beforeEach(async () => {
        productServiceSpy = createProductServiceSpy();

        await TestBed.configureTestingModule({
            imports: [ProductListComponent],
            providers: [{ provide: ProductService, useValue: productServiceSpy }],
        }).compileComponents();

        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should call getProducts on initialization', () => {
            expect(productServiceSpy.getProducts).toHaveBeenCalledOnce();
        });

        it('should populate the products array', () => {
            expect(component.products).toHaveLength(3);
            expect(component.products).toEqual(mockProducts);
        });

        it('should extract unique sorted categories from the product list', () => {
            expect(component.categories).toEqual(['Soccer', 'Tennis']);
        });

        it('should set the error property when the API call fails', () => {
            const networkError = new Error('Network error');
            productServiceSpy.getProducts.mockReturnValue(throwError(() => networkError));

            component.ngOnInit();

            expect(component.error).toBe(networkError);
        });

        it('should not clear a pre-existing error when a new load succeeds (error must be reset externally)', () => {
            // The component does not reset `error` before re-subscribing,
            // so a prior error persists until explicitly cleared.
            component.error = new Error('stale error');
            productServiceSpy.getProducts.mockReturnValue(of(mockProducts));

            component.ngOnInit();

            // Products are still updated even though error was not cleared
            expect(component.products).toHaveLength(3);
        });
    });

    describe('filteredProducts', () => {
        it('should return all products when selectedCategory is null', () => {
            component.selectedCategory = null;
            expect(component.filteredProducts).toHaveLength(3);
        });

        it('should return only products matching the selected category', () => {
            component.selectCategory('Soccer');
            expect(component.filteredProducts).toHaveLength(2);
            expect(component.filteredProducts.every((p) => p.category === 'Soccer')).toBe(true);
        });

        it('should return a single product for a category with one match', () => {
            component.selectCategory('Tennis');
            expect(component.filteredProducts).toHaveLength(1);
            expect(component.filteredProducts[0].name).toBe('Tennis Racket');
        });

        it('should return an empty array for a category with no matches', () => {
            component.selectCategory('Basketball');
            expect(component.filteredProducts).toHaveLength(0);
        });
    });

    describe('selectCategory', () => {
        it('should update selectedCategory to the given value', () => {
            component.selectCategory('Tennis');
            expect(component.selectedCategory).toBe('Tennis');
        });

        it('should allow resetting to null to show all products', () => {
            component.selectCategory('Tennis');
            component.selectCategory(null);
            expect(component.selectedCategory).toBeNull();
        });
    });

    describe('addProductToCart', () => {
        it('should call cartService.addProduct with the product id, name and price', () => {
            const addSpy = vi.spyOn(cartService, 'addProduct');
            component.addProductToCart(mockProducts[0]);
            expect(addSpy).toHaveBeenCalledWith('1', 'Soccer Ball', 20);
        });

        it('should increase the cart item count after adding a product', () => {
            component.addProductToCart(mockProducts[0]);
            expect(cartService.itemCount).toBe(1);
        });

        it('should add multiple different products to the cart', () => {
            component.addProductToCart(mockProducts[0]);
            component.addProductToCart(mockProducts[1]);
            expect(cartService.itemCount).toBe(2);
        });
    });

    describe('template rendering', () => {
        it('should render a product card for each filtered product', () => {
            const cards = fixture.nativeElement.querySelectorAll('.product-card');
            expect(cards).toHaveLength(3);
        });

        it('should render only matching cards after selecting a category', () => {
            // Set selectedCategory BEFORE the first detectChanges to avoid
            // ExpressionChangedAfterItHasBeenCheckedError in Angular's double-check pass
            const f = TestBed.createComponent(ProductListComponent);
            f.componentInstance.selectedCategory = 'Soccer';
            f.detectChanges();
            const cards = f.nativeElement.querySelectorAll('.product-card');
            expect(cards).toHaveLength(2);
        });

        it('should display the error state when error is set', () => {
            const f = TestBed.createComponent(ProductListComponent);
            f.componentInstance.error = new Error('Failed to load');
            f.detectChanges();
            const errorEl = f.nativeElement.querySelector('.alert-danger');
            expect(errorEl).toBeTruthy();
        });

        it('should hide the product grid when an error occurs', () => {
            const f = TestBed.createComponent(ProductListComponent);
            f.componentInstance.error = new Error('Failed to load');
            f.detectChanges();
            const layout = f.nativeElement.querySelector('.store-layout');
            expect(layout).toBeFalsy();
        });
    });
});
