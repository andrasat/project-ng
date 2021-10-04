import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-icon-arrow-left',
  templateUrl: './arrow-left.component.svg'
})
export class ArrowLeftComponent implements OnInit {
  @Input() color: string

  fillColor: string

  ngOnInit() {
    switch(this.color) {
      case 'white':
        this.fillColor = '#FFFFFF';
        break;
      case 'primary':
      default:
        this.fillColor = '#F07600';
    }
  }
}