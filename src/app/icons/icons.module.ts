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
  ]
})
export class IconModule {}