import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IconModule } from '@icons/icons.module';

import { TNCRoutingModule } from './tnc-routing.module';
import { TNCComponent } from './tnc.component';


@NgModule({
  imports: [
    TNCRoutingModule,
    ComponentsModule,
    IconModule,
    DirectivesModule,
  ],
  declarations: [
    TNCComponent
  ],
})
export class TNCModule { }
