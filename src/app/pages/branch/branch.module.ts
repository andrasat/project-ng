import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';
import { DirectivesModule } from '@directives/directives.module';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SearchMenuComponent } from './search-menu/search-menu.component';
import { MenuComponent } from './menu/menu.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { PaymentComponent } from './payment/payment.component';
import { PromotionComponent } from './promotion/promotion.component';
import { OthersComponent } from './others/others.component';
import { AboutUsCompanyComponent } from './about-us-company/about-us-company.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@NgModule({
  imports: [
    BranchRoutingModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbCarouselModule,
    NgbCollapseModule,
    ComponentsModule,
    IconModule,
    DirectivesModule,
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
    PromotionComponent,
    OthersComponent,
    AboutUsCompanyComponent,
    OrderHistoryComponent,
    OrderDetailComponent,
  ],
})
export class BranchModule {}
