import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IconModule } from '@icons/icons.module';

import { FAQRoutingModule } from './faq-routing.module';
import { FAQComponent } from './faq.component';


@NgModule({
  imports: [
    FAQRoutingModule,
    ComponentsModule,
    IconModule,
    DirectivesModule,
  ],
  declarations: [
    FAQComponent
  ],
})
export class FAQModule { }
