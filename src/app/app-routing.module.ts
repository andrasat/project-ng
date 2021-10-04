import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '',
      loadChildren: () => import('@pages/landing-page/landing-page.module').then(m => m.LandingPageModule)
    },
    {
      path: 'scan',
      loadChildren: () => import('@pages/qr-code-scanner/qr-code-scanner.module').then(m => m.QrCodeScannerModule)
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule {}
