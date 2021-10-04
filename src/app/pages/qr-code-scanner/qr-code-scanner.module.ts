import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { QrCodeScannerRoutingModule } from './qr-code-scanner-routing.module';
import { QrCodeScannerComponent } from './qr-code-scanner.component';

@NgModule({
  imports: [
    QrCodeScannerRoutingModule,
    ZXingScannerModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [
    QrCodeScannerComponent
  ]
})
export class QrCodeScannerModule {}