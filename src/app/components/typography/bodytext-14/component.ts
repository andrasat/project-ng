import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-bodytext-14',
  templateUrl: './bodytext-14.component.html',
  styleUrls: ['./bodytext-14.component.scss']
})
export class BodyText14Component implements OnInit, OnChanges {
  @Input() isSemiBold: boolean = false;
  @Input() isBold: boolean = false;
  @Input() isTruncate: boolean = false;
  @Input() color: string = 'black';

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      bold: this.isBold,
      semibold: this.isSemiBold,
      'text-truncate': this.isTruncate,
      [this.color]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentClasses = {
      bold: changes.isBold?.currentValue,
      semibold: changes.isSemiBold?.currentValue,
      'text-truncate': changes.isTruncate?.currentValue,
      [changes.color?.currentValue]: true,
    };
  }
}
