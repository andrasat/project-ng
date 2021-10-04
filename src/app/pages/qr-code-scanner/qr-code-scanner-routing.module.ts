import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { QrCodeScannerComponent } from "./qr-code-scanner.component";

@NgModule({
  imports: [RouterModule.forChild([{
    path: '',
    component: QrCodeScannerComponent,
  }])],
  exports: [RouterModule]
})
export class QrCodeScannerRoutingModule {}