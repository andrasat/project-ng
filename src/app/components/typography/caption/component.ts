import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent implements OnInit, OnChanges {
  @Input() isSemiBold: boolean = false;
  @Input() isBold: boolean = false;
  @Input() isTruncate: boolean = false;
  @Input() isStrikethrough: boolean = false;
  @Input() color: string = 'black';
  @Input() fontSize: number = 12;

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      bold: this.isBold,
      semibold: this.isSemiBold,
      strikethrough: this.isStrikethrough,
      'text-truncate': this.isTruncate,
      [this.color]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentClasses = {
      bold: changes.isBold?.currentValue,
      semibold: changes.isSemiBold?.currentValue,
      strikethrough: changes.isStrikethrough?.currentValue,
      'text-truncate': changes.isTruncate?.currentValue,
      [changes.color?.currentValue]: true,
    };
  }
}
