import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ArrowLeftComponent } from "./arrow-left/component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ArrowLeftComponent
  ],
  exports: [
    ArrowLeftComponent
  ]
})
export class IconModule {}