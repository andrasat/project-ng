import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SearchMenuComponent } from './restaurant/search-menu/search-menu.component';
import { MenuComponent } from './restaurant/menu/menu.component';
import { CheckoutComponent } from './restaurant/checkout/checkout.component';

@NgModule({
  imports: [
    BranchRoutingModule,
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
  ],
})
export class BranchModule {}
