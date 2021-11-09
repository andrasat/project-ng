import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';

import { PaymentSuccessRoutingModule } from './payment-success-routing.module';
import { PaymentSuccessComponent } from './payment-success.component';

@NgModule({
  imports: [
    PaymentSuccessRoutingModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    PaymentSuccessComponent
  ],
})
export class PaymentSuccessModule { }
