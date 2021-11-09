import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent implements OnInit, OnChanges {
  @Input() text: string = ''
  @Input() disabled: boolean = false
  @Input() smallPadding: boolean = false
  @Input() bgColor: string = ''

  @Output() public clicked: EventEmitter<void> = new EventEmitter()

  classes: Record<string, boolean>

  ngOnInit() {
    this.classes = {
      'small-padding': this.smallPadding,
      'disabled': this.disabled,
      [this.bgColor]: true,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.classes = {
      'small-padding': changes.smallPadding?.currentValue,
      'disabled': changes.disabled?.currentValue,
      [this.bgColor]: changes.bgColor?.currentValue,
    };
  }
}