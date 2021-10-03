import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '',
      loadChildren: () => import('@pages/landing-page/landing-page.module').then(m => m.LandingPageModule)
    }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule {}
