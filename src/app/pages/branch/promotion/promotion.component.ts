import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPromotion } from '@core/models';
import { LocationService, NavigationService, QSApiService } from '@core/services';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-promotion',
  templateUrl: 'promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})

export class PromotionComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public locationService: LocationService,
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
    if (this.queryParams.branchCode) {
      this.qsApiService.getPromotion(this.queryParams.branchCode);
    } else {
      this.locationService.currentPosition
        .pipe(take(1))
        .subscribe(position => {
          this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
        });

      this.qsApiService.branchList
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(branchList => {
          branchList?.branches.forEach(branch => {
            this.qsApiService.getPromotion(branch.branchCode);
          });
        });
    }

    this.qsApiService.promotion
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(promotions => {
        if (promotions) {
          this.promotions = promotions.reduce((allPromotions, currentPromo) => {
            const foundPromo = allPromotions.find(promo => promo.promotionID === currentPromo.promotionID);

            if (foundPromo) return allPromotions;
            return [...allPromotions, currentPromo];
          }, this.promotions);
        }
      });
  }

  getPromoImagePlaceholder(index: number) {
    if (index > 5) {
      const mod6 = index % 6;
      return `/assets/image/placeholder-promo-${mod6}.jpg`;
    }

    return `/assets/image/placeholder-promo-${index}.jpg`;
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