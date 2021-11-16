import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: 'label.component.html',
  styleUrls: ['./label.component.scss'],
})

export class LabelComponent implements OnInit, OnChanges {
  @Input() text: string = ''
  @Input() type: string = ''
  @Input() widePadding: boolean = false

  currentClasses: Record<string, boolean> = {}

  ngOnInit() {
    this.currentClasses = {
      [this.type]: true,
      'wide-padding': this.widePadding,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentClasses = {
      [changes.type?.currentValue]: true,
      'wide-padding': changes.widePadding?.currentValue,
    };
  }
}