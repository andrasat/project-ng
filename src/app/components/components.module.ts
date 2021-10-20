
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
  SearchBoxComponent,
  TextBoxComponent,
} from './inputs';

import {
  PrimaryButtonComponent,
  SecondaryButtonComponent,
} from './buttons';

import { ListComponent } from './list/list.component';

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
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    ListComponent,
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
    SearchBoxComponent,
    TextBoxComponent,
    PrimaryButtonComponent,
    SecondaryButtonComponent,
    ListComponent,
  ]
})
export class ComponentsModule {}
