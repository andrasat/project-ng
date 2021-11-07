import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBranches, IBranchList, IBrandData, IBrandList, IBrands } from '@core/models';
import { LocationService, NavigationService, QSApiService } from '@core/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search-restaurant',
  templateUrl: 'search-restaurant.component.html',
  styleUrls: ['./search-restaurant.component.scss'],
})

export class SearchRestaurantComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public navigation: NavigationService,
    public locationService: LocationService,
    public qsApiService: QSApiService,
  ) {
    route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  private unsubscribe$ = new Subject<void>()

  isSelectRestaurant = false
  isSearchRestaurant = false
  branchList: IBranchList | undefined
  brandList: IBrandList | undefined
  brandData: IBrandData | undefined
  currentPosition: GeolocationPosition
  params: any = {}

  filteredBranches: IBranches[]

  ngOnInit() {
    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => {
        this.currentPosition = position;
        this.qsApiService.getBrandList(position.coords.latitude, position.coords.longitude);
        this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchlist => this.branchList = branchlist);
    this.qsApiService.brandList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(brandList => this.brandList = brandList);
    this.qsApiService.brandData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(brandData => this.brandData = brandData);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setIsSearchRestaurant(value: boolean) {
    this.isSearchRestaurant = value;
  }

  goBack() {
    if (this.isSelectRestaurant) {
      this.isSelectRestaurant = false;
      return;
    }

    if (this.isSearchRestaurant) {
      this.isSearchRestaurant = false;
      return;
    }

    this.navigation.back(`/${this.params.companyCode}`);
  }

  goToBranchRestaurant(branchCode: string) {
    const sanitizedBranchCode = branchCode.includes(this.params.companyCode) ? branchCode.replace(`${this.params.companyCode}/`, '') : branchCode;
    this.navigation.navigate(`/${this.params.companyCode}/${sanitizedBranchCode}`);
  }

  onClickOutlets(brand: IBrands) {
    if (!brand.nearMeBranchCount) {
      return;
    }

    this.qsApiService.getBrandData(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude, brand.brandID);
    this.isSelectRestaurant = true;
  }

  onChangeSearch(value: string) {
    this.filteredBranches = this.branchList?.branches ?
      this.branchList?.branches.filter(branch => branch.branchName.toLowerCase().includes(value)) : [];
  }
}