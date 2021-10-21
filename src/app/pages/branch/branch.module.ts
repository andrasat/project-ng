import { NgModule } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { CompanyHomeComponent } from './company-home/company-home.component';

@NgModule({
  imports: [
    BranchRoutingModule,
    NgbCarouselModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    BranchComponent,
    CompanyHomeComponent,
  ],
})
export class BranchModule {}
