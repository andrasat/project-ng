import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { IconModule } from '@icons/icons.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { ChooseContactRoutingModule } from './choose-contact-routing.module';
import { ChooseContactComponent } from './choose-contact.component';

@NgModule({
  imports: [
    ChooseContactRoutingModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    ComponentsModule,
    IconModule,
  ],
  declarations: [ChooseContactComponent],
})
export class ChooseContactModule { }
