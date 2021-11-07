import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-bodytext-16',
  templateUrl: './bodytext-16.component.html',
  styleUrls: ['./bodytext-16.component.scss']
})
export class BodyText16Component implements OnInit, OnChanges {
  @Input() isSemiBold: boolean = false;
  @Input() isBold: boolean = false;
  @Input() color: string = 'black'

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      bold: this.isBold,
      semibold: this.isSemiBold,
      [this.color]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentClasses = {
      bold: changes.isBold?.currentValue,
      semibold: changes.isSemiBold?.currentValue,
      [changes.color?.currentValue]: true,
    };
  }
}