import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PaymentFailedComponent } from "./payment-failed.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: PaymentFailedComponent,
  }])],
  exports: [RouterModule]
})
export class PaymentFailedRoutingModule {}