import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { PaymentFailedRoutingModule } from './payment-failed-routing.module';
import { PaymentFailedComponent } from './payment-failed.component';

@NgModule({
  imports: [
    PaymentFailedRoutingModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    PaymentFailedComponent
  ],
})
export class PaymentFailedModule { }
