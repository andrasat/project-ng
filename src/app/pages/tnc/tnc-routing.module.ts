import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TNCComponent } from "./tnc.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: TNCComponent,
  }])],
  exports: [RouterModule]
})
export class TNCRoutingModule {}