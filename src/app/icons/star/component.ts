import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-star',
  templateUrl: './star.component.svg'
})
export class StarIconComponent implements OnInit, OnChanges {
  @Input() color: string
  @Input() height: number = 24
  @Input() width: number = 24

  fillColor: string

  ngOnInit() {
    switch(this.color) {
      case 'none':
        this.fillColor = 'none';
        break;
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    switch(changes.color?.currentValue) {
      case 'none':
        this.fillColor = 'none';
        break;
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }
}