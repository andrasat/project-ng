import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-card',
  templateUrl: 'menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
})
export class MenuCardComponent {
  @Input() cardImage: string = ''
  @Input() cardImageAlt: string = 'menu card'
  @Input() menuTitle: string = 'Menu Title'
  @Input() menuPrice: string = 'Rp0'
  @Input() menuDiscountPrice: string = ''
  @Input() isOutOfStock: boolean = false
}