import { NgModule } from "@angular/core";
import { ComponentsModule } from "@components/components.module";
import { DirectivesModule } from "@directives/directives.module";
import { IconModule } from "@icons/icons.module";

import { PaymentConfirmationRoutingModule } from "./payment-confirmation-routing.module";
import { PaymentConfirmationComponent } from "./payment-confirmation.component";

@NgModule({
  imports: [
    PaymentConfirmationRoutingModule,
    ComponentsModule,
    IconModule,
    DirectivesModule,
  ],
  declarations: [
    PaymentConfirmationComponent,
  ]
})
export class PaymentConfirmationModule {}