import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-chevron-right',
  templateUrl: './chevron-right.component.svg'
})
export class ChevronRightIconComponent implements OnInit, OnChanges {
  @Input() color: string

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