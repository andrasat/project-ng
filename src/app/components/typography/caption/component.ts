import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss'],
})
export class CaptionComponent implements OnInit {
  @Input() isSemiBold: boolean = false;
  @Input() isBold: boolean = false;
  @Input() color: string = 'black';

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      bold: this.isBold,
      semibold: this.isSemiBold,
      [this.color]: true,
    };
  }
}
