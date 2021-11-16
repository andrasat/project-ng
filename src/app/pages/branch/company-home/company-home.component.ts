import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { IAddress, IBranches, IBranchList } from '@core/models';
import { LocationService, NavigationService, QSApiService } from '@core/services';

import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-company-home',
  templateUrl: 'company-home.component.html',
  styleUrls: ['./company-home.component.scss'],
  providers: [NgbCarouselConfig],
})
export class CompanyHomeComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public locationService: LocationService,
    public navigation: NavigationService,
    public config: NgbCarouselConfig,
  ) {
    config.interval = 5000;
  }

  private unsubscribe$ = new Subject<void>()

  isSearchRestaurantCollapse = false
  branchList: IBranchList | undefined
  currentAddress: IAddress | undefined 
  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnInit() {
    this.locationService.currentPosition
      .pipe(take(1))
      .subscribe(position => {
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchList => this.branchList = branchList);

    this.qsApiService.currentAddress
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(address => this.currentAddress = address);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToAboutCompany() {
    this.navigation.navigate('others/about-us', { relativeTo: this.route });
  }

  goToSearchRestaurant() {
    this.navigation.navigate('/search-restaurant', { queryParams: { companyCode: this.branchList?.companyCode } });
  }

  goToLocation() {
    this.navigation.navigate('/location', { queryParams: { companyCode: this.branchList?.companyCode } });
  }

  goToBranchRestaurant(branch: IBranches) {
    if (!branch.flagNearMe || branch.businessHour.status === 'closed') {
      return;
    }

    this.navigation.navigate(`${branch.branchCode}`, { relativeTo: this.route });
  }
}