import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PaymentSuccessComponent } from "./payment-success.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: PaymentSuccessComponent,
  }])],
  exports: [RouterModule]
})
export class PaymentSuccessRoutingModule {}