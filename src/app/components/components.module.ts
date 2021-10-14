
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

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
  PrimaryButtonComponent,
  SecondaryButtonComponent,
} from './buttons';

@NgModule({
  imports: [
    CommonModule,
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
    PrimaryButtonComponent,
    SecondaryButtonComponent,
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
    PrimaryButtonComponent,
    SecondaryButtonComponent,
  ]
})
export class ComponentsModule {}