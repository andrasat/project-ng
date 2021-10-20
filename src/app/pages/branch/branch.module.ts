import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';

@NgModule({
  imports: [
    BranchRoutingModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    BranchComponent
  ],
})
export class BranchModule {}
