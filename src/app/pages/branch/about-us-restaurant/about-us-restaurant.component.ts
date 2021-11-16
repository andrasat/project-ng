import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IBranchData } from '@core/models';
import { NavigationService, QSApiService } from '@core/services';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-about-us-restaurant',
  templateUrl: 'about-us-restaurant.component.html',
  styleUrls: ['./about-us-restaurant.component.scss'],
})

export class AboutUsRestaurantComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public navigation: NavigationService,
    public qsApiService: QSApiService,
    private sanitizer: DomSanitizer,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  private unsubscribe$ = new Subject<void>()

  params: any = {}
  branchData: IBranchData | undefined
  businessHourData: any

  ngOnInit() {
    this.qsApiService.branchData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchData => {
        if (branchData) {
          this.branchData = branchData;
          this.businessHourData = branchData.businessHour.reduce((data: any, nextData) => {
            const hourKey = `${nextData.startTime} - ${nextData.endTime}`;
            if (data[hourKey]) {
              data[hourKey] = data[hourKey] + `, ${nextData.day.substring(0,3)}`;
            } else {
              data[hourKey] = nextData.day.substring(0,3);
            }

            return data;
          }, {});
        } else {
          this.qsApiService.getBranchData(this.params.branchCode);
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getBranchDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(this.branchData?.display.orderSummaryFooter || '');
  }

  getBusinessHourText() {
    const combinedText = Object.keys(this.businessHourData).reduce((text, key) => {
      if (text) {
        return text + '<br/>' + `${this.businessHourData[key]} ${key}`;
      } else {
        return `${this.businessHourData[key]} ${key}`;
      }
    }, '');

    return this.sanitizer.bypassSecurityTrustHtml(combinedText);
  }

  goBack() {
    this.navigation.back(`..`, { relativeTo: this.route });
  }
}