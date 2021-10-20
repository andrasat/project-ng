import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BranchComponent } from './branch.component';
import { BranchHomeComponent } from './branch-home/branch-home.component';
import { AddMenuComponent } from './branch-home/add-menu/add-menu.component';
import { PromotionComponent } from './promotion/promotion.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OthersComponent } from './others/others.component';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { ComponentsModule } from '@components/components.module';

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
          component: BranchHomeComponent,
        }, {
          path: ':branchCode/add-menu',
          pathMatch: 'full',
          component: AddMenuComponent
        }]
      },
    ]),
    ComponentsModule,
  ],
  exports: [RouterModule],
})
export class BranchRoutingModule { }
