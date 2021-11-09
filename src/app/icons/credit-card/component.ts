import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-credit-card',
  templateUrl: './credit-card.component.svg'
})
export class CreditCardIconComponent implements OnInit, OnChanges {
  @Input() color: string
  @Input() height: number = 32
  @Input() width: number = 32

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