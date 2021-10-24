import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ArrowLeftIconComponent } from "./arrow-left/component";
import { ChevronRightIconComponent } from "./chevron-right/component";
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
    ChevronRightIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    MarkerIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
  ],
  exports: [
    ArrowLeftIconComponent,
    ChevronRightIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    MarkerIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
  ]
})
export class IconModule {}