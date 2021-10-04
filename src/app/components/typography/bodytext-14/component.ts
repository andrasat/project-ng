import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-bodytext-14',
  templateUrl: './bodytext-14.component.html',
  styleUrls: ['./bodytext-14.component.scss']
})
export class BodyText14Component implements OnInit {
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
