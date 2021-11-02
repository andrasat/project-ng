import { formatCurrency } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IExtras } from '@core/models';

@Component({
  selector: 'app-menu-extra-list',
  templateUrl: 'menu-extra-list.component.html',
  styleUrls: ['./menu-extra-list.component.scss'],
})

export class MenuExtraListComponent implements OnInit {
  @Input() extra: IExtras
  @Output() counterChanged = new EventEmitter<number>()
  
  priceDisplay: string = ''
  counter: number = 0

  ngOnInit() {
    this.priceDisplay = formatCurrency(this.extra?.sellPrice || 0, 'id-ID', 'Rp', 'IDR', '1.0-0');
  }

  increment(maxExtraQty: number) {
    if (maxExtraQty > 0 && this.counter + 1 > maxExtraQty) {
      return;
    }

    this.counter = this.counter + 1;
    this.counterChanged.emit(this.counter);
  }

  decrement() {
    if (this.counter === 0) {
      return;
    }

    this.counter = this.counter - 1;
    this.counterChanged.emit(this.counter);
  }
}