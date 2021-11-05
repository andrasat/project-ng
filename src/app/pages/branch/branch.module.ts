import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SearchMenuComponent } from './search-menu/search-menu.component';
import { MenuComponent } from './menu/menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';

@NgModule({
  imports: [
    BranchRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbCollapseModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    BranchComponent,
    CompanyHomeComponent,
    RestaurantComponent,
    SearchMenuComponent,
    MenuComponent,
    CheckoutComponent,
    PromotionDetailComponent,
    PaymentComponent,
    PaymentConfirmationComponent,
  ],
})
export class BranchModule {}
