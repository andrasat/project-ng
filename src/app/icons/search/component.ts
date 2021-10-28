import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-icon-search',
  templateUrl: './search.component.svg'
})
export class SearchIconComponent implements OnInit, OnChanges {
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
    switch(changes.color?.currentValue) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'tangerine':
      default:
        this.fillColor = '#F07600';
    }
  }
}