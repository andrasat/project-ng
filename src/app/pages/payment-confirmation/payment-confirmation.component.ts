import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrderHistoryLocalStorage } from '@core/models';
import { QSApiService, StorageService } from '@core/services';
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

        // if (validatePaymentResult) {
        //   const orderHistoryData = this.storageService.getItem('orderHistory');

        //   this.qsApiService.geto

        //   if (orderHistoryData) {
        //     const orderHistory = JSON.parse(orderHistoryData);
        //   } else {
        //     const orderHistory: IOrderHistoryLocalStorage[] = [{ orderID: this.queryParams.orderID, status: validatePaymentResult?.status }]
        //   }

        //   this.storageService.setItem('orderHistory', JSON.stringify())
        // }

      });
  }
}