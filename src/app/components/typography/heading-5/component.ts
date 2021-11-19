import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-heading-5',
  templateUrl: './heading-5.component.html',
  styleUrls: ['./heading-5.component.scss'],
})
export class Heading5Component implements OnInit, OnChanges {
  @Input() color: string = 'black';

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      [this.color]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentClasses = {
      [changes.color?.currentValue]: true,
    };
  }
}