import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ArrowLeftIconComponent } from "./arrow-left/component";
import { BagIconComponent } from './bag/component';
import { ChevronDownIconComponent } from './chevron-down/component';
import { ChevronRightIconComponent } from "./chevron-right/component";
import { CloseIconComponent } from './close/component';
import { DeliveryBikeIconComponent } from './delivery-bike/component';
import { HistoryIconComponent } from "./history/component";
import { HomeIconComponent } from "./home/component";
import { MarkerIconComponent } from "./marker/component";
import { OthersIconComponent } from "./others/component";
import { PromotionIconComponent } from "./promotion/component";
import { SearchIconComponent } from "./search/component";
import { CircleMinusIconComponent } from './circle-minus-icon/component';
import { CirclePlusIconComponent } from './circle-plus-icon/component';
import { RadioIconComponent } from './radio/component';
import { ContactIconComponent } from './contact/component';
import { CheckboxIconComponent } from './checkbox/component';
import { QuestionIconComponent } from './question/component';
import { CreditCardIconComponent } from './credit-card/component';
import { StarIconComponent } from './star/component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ArrowLeftIconComponent,
    BagIconComponent,
    ChevronDownIconComponent,
    ChevronRightIconComponent,
    CloseIconComponent,
    DeliveryBikeIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    MarkerIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
    CircleMinusIconComponent,
    CirclePlusIconComponent,
    RadioIconComponent,
    ContactIconComponent,
    CheckboxIconComponent,
    QuestionIconComponent,
    CreditCardIconComponent,
    StarIconComponent,
  ],
  exports: [
    ArrowLeftIconComponent,
    BagIconComponent,
    ChevronDownIconComponent,
    ChevronRightIconComponent,
    CloseIconComponent,
    DeliveryBikeIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    MarkerIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
    CircleMinusIconComponent,
    CirclePlusIconComponent,
    RadioIconComponent,
    ContactIconComponent,
    CheckboxIconComponent,
    QuestionIconComponent,
    CreditCardIconComponent,
    StarIconComponent,
  ]
})
export class IconModule {}