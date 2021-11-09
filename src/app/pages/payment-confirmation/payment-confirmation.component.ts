import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService, QSApiService, StorageService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: 'payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss'],
})

export class PaymentConfirmationComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public storageService: StorageService,
    public navigation: NavigationService,
    public collapseConfig: NgbCollapseConfig,
  ) {
    collapseConfig.animation = false;
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  private unsubscribe$ = new Subject<void>()

  paymentHeaderClass: Record<string, boolean> = {}

  interval: number
  params: any = {}
  queryParams: any = {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.paymentHeaderClass = {
      [this.queryParams.paymentMethod]: true,
    };

    this.interval = window.setInterval(() => {
      this.qsApiService.validatePayment(this.queryParams.orderID);
    }, 2000);

    this.qsApiService.validatePaymentData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(validatePaymentResult => {

        if (validatePaymentResult && validatePaymentResult.status === 'settlement') {
          const orderHistoryData = this.storageService.getItem('orderHistory');
          let orderHistory: string[] = [];

          if (orderHistoryData) {
            orderHistory = JSON.parse(orderHistoryData) as string[];
          } else {
            orderHistory = [this.queryParams.orderID];
          }

          this.storageService.setItem('orderHistory', JSON.stringify(orderHistory));
          this.storageService.removeItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`);

          this.navigation.navigate('/payment-success', {
            queryParams: {
              orderID: this.queryParams.orderID,
            },
          });
        }

        if (validatePaymentResult && !!validatePaymentResult.errorMessage) {
          this.navigation.navigate('/payment-failed', {
            queryParams: {
              companyCode: this.queryParams.companyCode,
              branchCode: this.queryParams.branchCode,
            },
          });
        }

      });
  }
}