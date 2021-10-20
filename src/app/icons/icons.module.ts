import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ArrowLeftIconComponent } from "./arrow-left/component";
import { HistoryIconComponent } from "./history/component";
import { HomeIconComponent } from "./home/component";
import { OthersIconComponent } from "./others/component";
import { PromotionIconComponent } from "./promotion/component";
import { SearchIconComponent } from "./search/component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ArrowLeftIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
  ],
  exports: [
    ArrowLeftIconComponent,
    HistoryIconComponent,
    HomeIconComponent,
    OthersIconComponent,
    PromotionIconComponent,
    SearchIconComponent,
  ]
})
export class IconModule {}