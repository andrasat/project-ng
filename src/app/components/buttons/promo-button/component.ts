import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-promo-button',
  templateUrl: 'promo-button.component.html',
  styleUrls: ['./promo-button.component.scss'],
})

export class PromoButtonComponent {
  @Input() text: string = ''
  @Output() public clicked: EventEmitter<void> = new EventEmitter()
}