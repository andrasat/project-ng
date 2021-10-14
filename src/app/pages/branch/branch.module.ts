import { NgModule } from '@angular/core';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';

@NgModule({
  imports: [
    BranchRoutingModule,
  ],
  declarations: [
    BranchComponent
  ],
})
export class BranchModule {}
