import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ThankYouComponent } from './thank-you.component';

describe('ThankYouComponent', () => {
    let component: ThankYouComponent;
    let fixture: ComponentFixture<ThankYouComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ThankYouComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(ThankYouComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render some content in the template', () => {
        expect(fixture.nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should include a link back to /products', () => {
        const link = fixture.nativeElement.querySelector('a[routerLink="/products"]');
        expect(link).toBeTruthy();
    });
});
