import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { MenuComponent } from './restaurant/menu/menu.component';
import { PromotionComponent } from './promotion/promotion.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OthersComponent } from './others/others.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BranchComponent,
        children: [{
          path: '',
          pathMatch: 'full',
          component: CompanyHomeComponent,
        }, {
          path: 'promotion',
          pathMatch: 'full',
          component: PromotionComponent
        }, {
          path: 'order-history',
          pathMatch: 'full',
          component: OrderHistoryComponent
        }, {
          path: 'others',
          pathMatch: 'full',
          component: OthersComponent
        }, {
          path: ':branchCode',
          pathMatch: 'full',
          component: RestaurantComponent,
        }, {
          path: ':branchCode/menu',
          pathMatch: 'full',
          component: MenuComponent
        }]
      },
    ]),
  ],
  exports: [RouterModule],
})
export class BranchRoutingModule { }
