import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from '@core/services';

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
        path: 'search-restaurant',
        pathMatch: 'full',
        loadChildren: () => import('@pages/search-restaurant/search-restaurant.module' /* webpackChunkName: "search-restaurant" */).then(m => m.SearchRestaurantModule),
      },
      {
        path: 'contacts',
        pathMatch: 'full',
        loadChildren: () => import('@pages/choose-contact/choose-contact.module' /* webpackChunkName: "choose-contact" */).then(m => m.ChooseContactModule),
      },
      {
        path: 'faq',
        pathMatch: 'full',
        loadChildren: () => import('@pages/faq/faq.module' /* webpackChunkName: "faq" */).then(m => m.FAQModule),
      },
      {
        path: ':companyCode',
        canActivate: [AuthGuardService],
        loadChildren: () => import('@pages/branch/branch.module' /* webpackChunkName: "branch" */).then(m => m.BranchModule),
      }
    ]),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
