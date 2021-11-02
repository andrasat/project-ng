
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
} from './cards';

import {
  SearchBoxComponent,
  TextBoxComponent,
} from './inputs';

import {
  PrimaryButtonComponent,
  SecondaryButtonComponent,
  PromoButtonComponent,
} from './buttons';

import {
  MenuListComponent,
  MenuExtraListComponent,
  MenuPackageListComponent,
} from './lists';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { LabelComponent } from './label/label.component';

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
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PromoButtonComponent,
    TimePickerComponent,
    MenuListComponent,
    MenuExtraListComponent,
    MenuPackageListComponent,
    LabelComponent,
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
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    PromoButtonComponent,
    TimePickerComponent,
    MenuListComponent,
    MenuExtraListComponent,
    MenuPackageListComponent,
    LabelComponent,
  ]
})
export class ComponentsModule {}
