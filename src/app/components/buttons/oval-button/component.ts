import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-oval-button',
  templateUrl: './oval-button.component.html',
  styleUrls: ['./oval-button.component.scss'],
})
export class OvalButtonComponent implements OnInit, OnChanges {
  @Input() text: string = ''
  @Input() smallPadding: boolean = false
  @Input() selected: boolean = false
  @Input() bgColor: string = ''

  @Output() public clicked: EventEmitter<void> = new EventEmitter()

  classes: Record<string, boolean>

  ngOnInit() {
    this.classes = {
      'small-padding': this.smallPadding,
      'selected': this.selected,
      [this.bgColor]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.classes = {
      'small-padding': changes.smallPadding?.currentValue,
      'selected': changes.selected?.currentValue,
      [this.bgColor]: changes.bgColor?.currentValue,
    };
  }
}