import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService, StorageService } from '@core/services';

@Component({
  selector: 'app-payment-failed',
  templateUrl: 'payment-failed.component.html',
  styleUrls: ['./payment-failed.component.scss'],
})

export class PaymentFailedComponent {
  constructor(
    public route: ActivatedRoute,
    public storageService: StorageService,
    public navigation: NavigationService,
  ) {
    route.queryParams.subscribe(queryParams => this.queryParams = queryParams);
  }

  queryParams: any = {}

  tryAgainPayment() {
    return this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/payment`);
  }

  cancelOrder() {
    this.storageService.removeItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`);

    return this.navigation.navigate(`/${this.queryParams.companyCode}`);
  }
}