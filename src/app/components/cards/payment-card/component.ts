import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBranchDataPaymentOnline } from '@core/models';

@Component({
  selector: 'app-payment-card',
  templateUrl: 'payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})

export class PaymentCardComponent {
  @Input() payment: IBranchDataPaymentOnline
  @Input() selected: boolean
  @Output() radioClick = new EventEmitter()
}