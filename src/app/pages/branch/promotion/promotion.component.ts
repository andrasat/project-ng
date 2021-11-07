import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPromotion } from '@core/models';
import { NavigationService, QSApiService } from '@core/services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-promotion',
  templateUrl: 'promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})

export class PromotionComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public navigation: NavigationService,
  ) {
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  private unsubscribe$ = new Subject<void>()

  queryParams: any = {}
  promotions: IPromotion[] = []

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    if (!this.queryParams.branchCode) {
      return this.navigation.back('../', {
        relativeTo: this.route,
      });
    }

    this.qsApiService.getPromotion(this.queryParams.branchCode);

    this.qsApiService.promotion
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(promotions => this.promotions = promotions || []);
  }

  goToPromoDetail(promotion: IPromotion) {
    return this.navigation.navigate(`${promotion.promotionID}`, {
      relativeTo: this.route,
      queryParams: {
        promoCode: promotion.promotionCode,
      }
    });
  }
}