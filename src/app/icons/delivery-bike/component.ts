import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-delivery-bike',
  templateUrl: './delivery-bike.component.svg'
})
export class DeliveryBikeIconComponent implements OnInit, OnChanges {
  @Input() color: string
  @Input() height = 72
  @Input() width = 72

  fillColor: string

  ngOnInit() {
    switch(this.color) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'black':
        this.fillColor = '#000000';
        break;
      case 'grey':
        this.fillColor = '#828282';
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
      case 'grey':
        this.fillColor = '#828282';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }
}