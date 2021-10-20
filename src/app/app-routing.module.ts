import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('@pages/landing-page/landing-page.module' /* webpackChunkName: "landing-page" */).then(m => m.LandingPageModule),
      },
      {
        path: 'login',
        pathMatch: 'full',
        loadChildren: () => import('@pages/login/login.module' /* webpackChunkName: "login" */).then(m => m.LoginModule),
      },
      {
        path: 'scan',
        pathMatch: 'full',
        loadChildren: () => import('@pages/qr-code-scanner/qr-code-scanner.module' /* webpackChunkName: "qc-scan" */).then(m => m.QrCodeScannerModule),
      },
      {
        path: 'location',
        pathMatch: 'full',
        loadChildren: () => import('@pages/location/location.module' /* webpackChunkName: "location" */).then(m => m.LocationModule),
      },
      {
        path: ':companyCode',
        loadChildren: () => import('@pages/branch/branch.module' /* webpackChunkName: "branch" */).then(m => m.BranchModule),
      }
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
