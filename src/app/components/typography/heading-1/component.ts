import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-heading-1',
  templateUrl: './heading-1.component.html',
  styleUrls: ['./heading-1.component.scss'],
})
export class Heading1Component implements OnInit {
  @Input() color: string = 'black'

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      [this.color]: true
    };
  }
}