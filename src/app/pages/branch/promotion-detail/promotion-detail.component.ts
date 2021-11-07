import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrderInput } from '@core/models';
import { NavigationService, StorageService } from '@core/services';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: 'promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss'],
})

export class PromotionDetailComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public storage: StorageService,
    public navigation: NavigationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  params: any = {}
  queryParams: any = {}

  orderInput: IOrderInput | undefined

  ngOnInit() {
    if (this.queryParams.branchCode) {
      const orderInputData = this.storage.getItem(`order_${this.params.companyCode}_${this.queryParams.branchCode}`);

      if (orderInputData) {
        this.orderInput = JSON.parse(orderInputData);
      }
    }
  }

  goBack() {
    if (this.queryParams.from === 'checkout' && this.queryParams.companyCode && this.queryParams.branchCode && this.queryParams.orderMode) {
      return this.navigation.back(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
        queryParams: { orderMode: this.queryParams.orderMode },
      });
    }

    return this.navigation.back('..', {
      relativeTo: this.route,
    });
  }

  copyPromoCode() {
    navigator.clipboard.writeText(this.queryParams.promoCode);
    alert('Promo Code copied');
  }

  shareLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied');
  }

  applyPromoCode() {
    if (this.queryParams.from === 'checkout' && this.queryParams.companyCode && this.queryParams.branchCode && this.queryParams.orderMode) {
      return this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
        queryParams: {
          orderMode: this.queryParams.orderMode,
          applyPromoCode: this.queryParams.promoCode,
        },
      });
    }

    if (this.orderInput) {
      this.orderInput.promotionCode = this.queryParams.promoCode;
      this.storage.setItem(`order_${this.params.companyCode}_${this.queryParams.branchCode}`, JSON.stringify(this.orderInput));
      return this.navigation.navigate(`../${this.queryParams.branchCode}`, {
        relativeTo: this.route,
      });
    }

    return;
  }
}