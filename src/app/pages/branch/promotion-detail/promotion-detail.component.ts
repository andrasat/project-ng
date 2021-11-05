import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: 'promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss'],
})

export class PromotionDetailComponent {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  params: any = {}
  queryParams: any = {}

  goBack() {
    if (this.queryParams.from === 'checkout' && this.queryParams.companyCode && this.queryParams.branchCode && this.queryParams.orderMode) {
      return this.router.navigate([`/${this.queryParams.companyCode}/home/${this.queryParams.branchCode}/checkout`], {
        queryParams: { orderMode: this.queryParams.orderMode },
      });
    }

    return this.router.navigate(['..'], {
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
      return this.router.navigate([`/${this.queryParams.companyCode}/home/${this.queryParams.branchCode}/checkout`], {
        queryParams: {
          orderMode: this.queryParams.orderMode,
          applyPromoCode: this.queryParams.promoCode,
        },
      });
    }

    return;
  }
}