import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-heading-3',
  templateUrl: './heading-3.component.html',
  styleUrls: ['./heading-3.component.scss'],
})
export class Heading3Component implements OnInit, OnChanges {
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