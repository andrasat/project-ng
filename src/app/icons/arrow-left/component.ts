import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-arrow-left',
  templateUrl: './arrow-left.component.svg'
})
export class ArrowLeftIconComponent implements OnInit, OnChanges {
  @Input() color: string

  fillColor: string

  ngOnInit() {
    switch(this.color) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    switch(changes.color.currentValue) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }
}