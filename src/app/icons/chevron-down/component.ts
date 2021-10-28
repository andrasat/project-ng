import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-chevron-down',
  templateUrl: './chevron-down.component.svg'
})
export class ChevronDownIconComponent implements OnInit, OnChanges {
  @Input() color: string
  @Input() width: number = 14

  fillColor: string

  ngOnInit() {
    switch(this.color) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'black':
        this.fillColor = '#000000';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    switch(changes.color?.currentValue) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'black':
        this.fillColor = '#000000';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }
}