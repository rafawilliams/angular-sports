import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'placeorder', component: PlaceOrderComponent },
    { path: 'complete', component: ThankYouComponent },
    { path: '**', redirectTo: '/products' }
];
