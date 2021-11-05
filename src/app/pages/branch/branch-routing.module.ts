import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { MenuComponent } from './menu/menu.component';
import { PromotionComponent } from './promotion/promotion.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OthersComponent } from './others/others.component';
import { SearchMenuComponent } from './search-menu/search-menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BranchComponent,
        children: [{
          path: 'home',
          pathMatch: 'full',
          component: CompanyHomeComponent,
        }, {
          path: 'promotion',
          pathMatch: 'full',
          component: PromotionComponent
        }, {
          path: 'promotion/:promoID',
          pathMatch: 'full',
          component: PromotionDetailComponent,
        }, {
          path: 'order-history',
          pathMatch: 'full',
          component: OrderHistoryComponent
        }, {
          path: 'others',
          pathMatch: 'full',
          component: OthersComponent
        }, {
          path: 'home/:branchCode',
          pathMatch: 'full',
          component: RestaurantComponent,
        }, {
          path: 'home/:branchCode/checkout',
          pathMatch: 'full',
          component: CheckoutComponent,
        }, {
          path: 'home/:branchCode/search-menu',
          pathMatch: 'full',
          component: SearchMenuComponent,
        }, {
          path: 'home/:branchCode/payment',
          pathMatch: 'full',
          component: PaymentComponent,
        }, {
          path: 'home/:branchCode/payment-confirmation',
          pathMatch: 'full',
          component: PaymentConfirmationComponent,
        }, {
          path: 'home/:branchCode/menu/:menuID',
          pathMatch: 'full',
          component: MenuComponent
        }]
      },
    ]),
  ],
  exports: [RouterModule],
})
export class BranchRoutingModule { }
