import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';

@NgModule({
  imports: [
    LandingPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    LandingPageComponent
  ],
})
export class LandingPageModule {}
