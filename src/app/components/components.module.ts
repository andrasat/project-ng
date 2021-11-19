
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IconModule } from "@icons/icons.module";

import {
  BodyText14Component,
  BodyText16Component,
  CaptionComponent,
  Heading1Component,
  Heading2Component,
  Heading3Component,
  Heading4Component,
  Heading5Component,
  LinkComponent,
  SubtitleComponent
} from "./typography";

import {
  LocationCardComponent,
  MenuCardComponent,
  RestaurantCardComponent,
  PaymentCardComponent,
} from './cards';

import {
  SearchBoxComponent,
  TextBoxComponent,
} from './inputs';

import {
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  PromoButtonComponent,
  OvalButtonComponent,
} from './buttons';

import {
  MenuListComponent,
  MenuExtraListComponent,
  MenuPackageListComponent,
  ContactListComponent,
} from './lists';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { LabelComponent } from './label/label.component';
import { AccordionComponent } from './accordion/accordion.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
  ],
  declarations: [
    Heading1Component,
    Heading2Component,
    Heading3Component,
    Heading4Component,
    Heading5Component,
    BodyText16Component,
    BodyText14Component,
    SubtitleComponent,
    CaptionComponent,
    LinkComponent,
    LocationCardComponent,
    MenuCardComponent,
    RestaurantCardComponent,
    PaymentCardComponent,
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PromoButtonComponent,
    OvalButtonComponent,
    TimePickerComponent,
    MenuListComponent,
    MenuExtraListComponent,
    MenuPackageListComponent,
    ContactListComponent,
    LabelComponent,
    AccordionComponent,
  ],
  exports: [
    CommonModule,
    Heading1Component,
    Heading2Component,
    Heading3Component,
    Heading4Component,
    Heading5Component,
    BodyText16Component,
    BodyText14Component,
    SubtitleComponent,
    CaptionComponent,
    LinkComponent,
    LocationCardComponent,
    MenuCardComponent,
    RestaurantCardComponent,
    PaymentCardComponent,
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PromoButtonComponent,
    OvalButtonComponent,
    TimePickerComponent,
    MenuListComponent,
    MenuExtraListComponent,
    MenuPackageListComponent,
    ContactListComponent,
    LabelComponent,
    AccordionComponent,
  ]
})
export class ComponentsModule {}
