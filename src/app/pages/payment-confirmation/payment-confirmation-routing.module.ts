import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PaymentConfirmationComponent } from "./payment-confirmation.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: PaymentConfirmationComponent,
  }])],
  exports: [RouterModule]
})
export class PaymentConfirmationRoutingModule {}