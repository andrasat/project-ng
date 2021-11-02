import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranches, IBranchList, IBrandData, IBrandList, IBrands } from '@core/models';
import { LocationService, QSApiService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-restaurant',
  templateUrl: 'search-restaurant.component.html',
  styleUrls: ['./search-restaurant.component.scss'],
})

export class SearchRestaurantComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public locationService: LocationService,
    public qsApiService: QSApiService,
  ) {
    route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  isSelectRestaurant = false
  isSearchRestaurant = false
  branchList: IBranchList | undefined
  brandList: IBrandList | undefined
  brandData: IBrandData | undefined
  currentPosition: GeolocationPosition
  params: any = {}
  observer: Subscription | undefined

  filteredBranches: IBranches[]

  ngOnInit() {
    this.observer = this.locationService.currentPosition.subscribe(position => {
      this.currentPosition = position;
      this.qsApiService.getBrandList(position.coords.latitude, position.coords.longitude);
      this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
    });

    this.qsApiService.branchList.subscribe(branchlist => this.branchList = branchlist);
    this.qsApiService.brandList.subscribe(brandList => this.brandList = brandList);
    this.qsApiService.brandData.subscribe(brandData => this.brandData = brandData);
  }

  ngOnDestroy() {
    this.observer?.unsubscribe();
  }

  setIsSearchRestaurant(value: boolean) {
    this.isSearchRestaurant = value;
  }

  navigateOnClick() {
    if (this.isSelectRestaurant) {
      this.isSelectRestaurant = false;
      return;
    }

    if (this.isSearchRestaurant) {
      this.isSearchRestaurant = false;
      return;
    }

    this.router.navigate([`/${this.params.companyCode}/home`]);
  }

  goToBranchRestaurant(branchCode: string) {
    const sanitizedBranchCode = branchCode.includes(this.params.companyCode) ? branchCode.replace(`${this.params.companyCode}/`, '') : branchCode;
    this.router.navigate([`/${this.params.companyCode}/home/${sanitizedBranchCode}`]);
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