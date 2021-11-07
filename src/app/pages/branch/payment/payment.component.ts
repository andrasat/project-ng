import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranchData, IBranchDataPaymentOnline, ICalculateTotalResult, IOrderInput } from '@core/models';
import { NavigationService, QSApiService, StorageService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { formatIDR } from '@utils/formatIDR';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.component.html',
  styleUrls: ['./payment.component.scss'],
})

export class PaymentComponent implements OnInit, OnDestroy {
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

  phoneFormControl = new FormControl('', [Validators.pattern(/\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/)])

  branchData: IBranchData | undefined
  orderInput: IOrderInput
  calculateResult: ICalculateTotalResult | undefined
  selectedPaymentMethod: IBranchDataPaymentOnline | undefined

  hideCollapseContainer = true
  showAlertError = false
  confirmTnC = false
  alertErrorMessage = ''

  params: any = {}
  queryParams: any = {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
    } else {
      return this.navigation.back('..');
    }

    this.qsApiService.getBranchData(this.params.branchCode);

    this.qsApiService.branchData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchData => this.branchData = branchData);

    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.calculateResult = result;
          this.orderInput.amount = result.grandTotal;

          this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
        },
      );
  }

  formatToCurrency(price: number) {
    return formatIDR(price);
  }

  showPaymentDetail() {
    this.hideCollapseContainer = false;
  }

  clickConfirmTnC(paymentMethod: IBranchDataPaymentOnline) {
    if (this.selectedPaymentMethod?.id === paymentMethod.id) this.confirmTnC = !this.confirmTnC;
  }

  selectPayment(paymentMethod: IBranchDataPaymentOnline) {
    this.selectedPaymentMethod = paymentMethod;
    this.confirmTnC = false;
  }

  confirmPayment() {
    if (!this.selectedPaymentMethod) return;
    if (!this.confirmTnC) return;
    if (!this.phoneFormControl.valid) return;

    this.orderInput.paymentMethodID = this.selectedPaymentMethod.id;
    if (this.selectedPaymentMethod.needPhoneInput) {
      if (!this.phoneFormControl.value) return;
      this.orderInput.phoneNumber = this.phoneFormControl.value;
    }

    this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    this.qsApiService.saveOrder(this.orderInput, this.params.branchCode)
      .subscribe(
        result => {
          if (result.redirectApp) {
            window.location.href = result.redirectApp;
            return;
          }

          if (result.redirectURL) {
            window.location.href = result.redirectURL;
            return;
          }

          this.navigation.navigate(`/payment-confirmation`, {
            queryParams: {
              paymentMethod: this.selectedPaymentMethod?.id,
              orderID: result.orderID,
            }
          });
        },
        error => {
          this.showAlertError = true;
          this.alertErrorMessage = error.message;

          setTimeout(() => {
            this.showAlertError = false;
            this.alertErrorMessage = '';
          }, 2500);
        },
      );
  }
}