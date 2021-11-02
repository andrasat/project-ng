import { formatCurrency } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IMenus } from '@core/models';

@Component({
  selector: 'app-menu-list',
  templateUrl: 'menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})

export class MenuListComponent implements OnInit {
  @Input() menu: IMenus

  priceDisplay: string = ''
  discountedPriceDisplay: string = ''

  ngOnInit() {
    this.priceDisplay = this.menu.sellPrice ? formatCurrency(this.menu.sellPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : this.menu.zeroValueText;
    this.discountedPriceDisplay = this.menu.originalSellPrice !== this.menu.sellPrice ? formatCurrency(this.menu.originalSellPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
  }
}