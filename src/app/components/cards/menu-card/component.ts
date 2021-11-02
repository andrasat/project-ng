import { formatCurrency } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-menu-card',
  templateUrl: 'menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
})
export class MenuCardComponent implements OnInit {
  @Input() cardImage: string = ''
  @Input() cardImageAlt: string = 'menu card'
  @Input() menuTitle: string = 'Menu Title'
  @Input() menuPrice: number = 0
  @Input() menuDiscountPrice: number = 0
  @Input() isOutOfStock: boolean = false

  priceDisplay: string = ''
  discountedPriceDisplay: string = ''

  ngOnInit() {
    this.priceDisplay = this.menuPrice ? formatCurrency(this.menuPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
    this.discountedPriceDisplay = this.menuDiscountPrice && this.menuDiscountPrice !== this.menuPrice ? formatCurrency(this.menuDiscountPrice, 'id-ID', 'Rp', 'IDR', '1.0-0') : '';
  }
}