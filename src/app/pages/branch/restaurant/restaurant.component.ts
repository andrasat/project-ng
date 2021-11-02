import { formatCurrency } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBranchData, IBranchDataOrderModes, IBranches, IBranchList, IMenuCategoryDetails, IMenuData, IMenus, IOrderInput, IPromotion } from '@core/models';
import { LocationService, QSApiService, StorageService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant',
  templateUrl: 'restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  constructor(
    public collapseConfig: NgbCollapseConfig,
    public route: ActivatedRoute,
    public router: Router,
    public qsApiService: QSApiService,
    public locationService: LocationService,
    public storageService: StorageService,
  ) {
    collapseConfig.animation = false;

    route.params.subscribe(params => {
      this.params = { ...this.params, ...params };
    });

    route.parent?.params.subscribe(params => {
      this.params = { ...this.params, ...params };
    });

    route.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;

      if (queryParams.orderMode) {
        this.selectedOrderMode = queryParams.orderMode;
      }
    });
  }

  branchDataObs: Subscription;
  menuDataObs: Subscription;

  hideCollapseContainer = false
  showMenuDrawer = false;
  showOutletClosed: boolean | undefined
  selectedOrderMode = ''
  selectedHour = ''
  selectedMinute = ''
  businessHourText = ''
  displayTotalAmount = ''

  menuData: IMenuData | undefined
  branchData: IBranchData | undefined
  branchList: IBranchList | undefined
  currentPosition: GeolocationPosition
  orderInput: IOrderInput

  orderModes: IBranchDataOrderModes[] = []
  openBranches: IBranches[] = []
  promotions: IPromotion[] = []
  popularMenus: IMenus[] = []
  priceChoppedMenus: IMenus[] = []

  params: any = {}
  queryParams: any = {}

  images = [
    'assets/image/placeholder-promo-1.jpg',
    'assets/image/placeholder-promo-2.jpg',
    'assets/image/placeholder-promo-3.jpg'
  ]

  ngOnDestroy() {
    this.qsApiService.resetMenu();
    this.qsApiService.resetBranchData();

    this.menuDataObs.unsubscribe();
    this.branchDataObs.unsubscribe();
  }

  ngOnInit() {
    this.qsApiService.getBranchData(this.params.branchCode);
    this.qsApiService.getPromotion(this.params.branchCode);

    this.locationService.currentPosition.subscribe(position => this.currentPosition = position);
    this.qsApiService.promotion.subscribe(promotions => this.promotions = promotions || []);

    this.qsApiService.branchList.subscribe(branchList => {
      this.branchList = branchList;

      this.openBranches = branchList ?
        branchList.branches.filter(branch => branch.businessHour.status.includes('open'))
        : [];
    });

    this.branchDataObs = this.qsApiService.branchData.subscribe(branchData => {
      this.branchData = branchData;

      const today = branchData?.businessHour.find(hour => hour.isCurrentDay);
      this.businessHourText = `${branchData?.businessHour[0].day} - ${branchData?.businessHour[branchData?.businessHour.length - 1].day} ${today?.startTime} - ${today?.endTime}`;
      this.orderModes = branchData?.orderModes ? branchData?.orderModes.filter(mode => mode.type?.match(/takeAway|delivery/)) : [];
      this.showOutletClosed = typeof branchData?.isOpen !== 'undefined' ? !branchData?.isOpen : undefined;

      if (!this.branchList && this.showOutletClosed === true) {
        this.qsApiService.getBranchList(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude);
      }

      if (branchData && this.queryParams.orderMode) {
        this.hideCollapseContainer = true;
        const selectedMode = this.orderModes.find(mode => mode.type === this.queryParams.orderMode);

        this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);

        const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

        if (orderInputData) {
          this.orderInput = JSON.parse(orderInputData);
          this.orderInput.type = selectedMode?.type!;
          this.orderInput.visitPurposeID = selectedMode?.visitPurposeID!;

          const totalAmount = this.orderInput.salesMenus.reduce((total, saleMenu) => {
            const totalPackage = saleMenu.packages.reduce((amountPackages, packageData) => {
              return amountPackages + (packageData.sellPrice * saleMenu.qty);
            }, 0);

            const totalExtras = saleMenu.extras.reduce((amountExtras, extraData) => {
              return amountExtras + (extraData.sellPrice * saleMenu.qty);
            }, 0);

            return total + totalPackage + totalExtras + (saleMenu.sellPrice * saleMenu.qty);
          }, 0);

          this.orderInput.amount = totalAmount;
          this.displayTotalAmount = formatCurrency(totalAmount, 'id-ID', 'Rp', 'IDR', '1.0-0');
        } else {
          this.orderInput = {
            type: selectedMode?.type!,
            typeName: null,
            amount: 0,
            deliveryAddress: '',
            deliveryAddressInfo: null,
            email: '',
            fullName: '',
            memberID: null,
            paymentMethodID: '',
            visitPurposeID: selectedMode?.visitPurposeID!,
            latitude: this.currentPosition.coords.latitude,
            longitude: this.currentPosition.coords.longitude,
            phoneNumber: '',
            promotionCode: '',
            salesMenus: [],
            vouchers: [],
            returnUrl: '',
          };
        }

        this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
      }
    });

    this.menuDataObs = this.qsApiService.menu.subscribe(menu => {
      this.menuData = menu;

      // Get recommendation menu id list
      const recommendationMenuIdList = menu?.menuRecommendations?.reduce((menuIdList: number[], nextRecommendation) => {
        const menuIds = nextRecommendation.menuIDs;

        if (menuIdList.length === 0) return [...menuIds];

        let menuIdString = menuIds.join(',');

        menuIdList.forEach(menuId => {
          if (menuIdString.includes(String(menuId))) {
            menuIdString = menuIdString.replace(String(menuId), '');
          }
        });

        const newMenuIds = menuIdString
          .split(',')
          .filter(menuId => !!menuId)
          .map(menuId => Number(menuId));

        return [...menuIdList, ...newMenuIds];
      }, []);

      // Get menu list by recommendation ids
      const popularMenuList = menu?.menuCategories.reduce((list: IMenus[], menuCategory) => {

        const menusByCategoryDetail = menuCategory.menuCategoryDetails.reduce((menuList: IMenus[], menuCategoryDetail) => {
          return [ ...menuList, ...menuCategoryDetail.menus];
        }, []);

        const recommendationMenus = recommendationMenuIdList ?
          recommendationMenuIdList.reduce((menus: IMenus[], nextMenuId) => {
            const recommendedMenu = menusByCategoryDetail.find(menu => menu.menuID === nextMenuId);
            const isAlreadyInList = list.find(menu => menu.menuID === nextMenuId);

            if (recommendedMenu && !isAlreadyInList) {
              return [...menus, recommendedMenu];
            }

            return menus;
          }, [])
          : menusByCategoryDetail;

        return [...list, ...recommendationMenus];
      }, []);

      // Get price chopped menu list
      const priceChoppedMenuList = menu?.menuCategories.reduce((list: IMenus[], menuCategory) => {

        const menusByCategoryDetail = menuCategory.menuCategoryDetails.reduce((menuList: IMenus[], menuCategoryDetail) => {
          return [ ...menuList, ...menuCategoryDetail.menus]; 
        }, []);

        const priceChoppedMenus = menusByCategoryDetail.filter(menus => menus.originalSellPrice !== menus.sellPrice);

        return [...list, ...priceChoppedMenus];
      }, []);

      this.popularMenus = popularMenuList || [];
      this.priceChoppedMenus = priceChoppedMenuList || [];
    });
  }

  getFragmentId(menuDesc: string) {
    return menuDesc.replace(/\W/g, '');
  }

  getMenuLength(menuCategoryDetails: IMenuCategoryDetails[]) {
    return menuCategoryDetails.reduce((total, menuCategoryDetail) => {
      return menuCategoryDetail.menus.length + total;
    }, 0);
  }

  selectOrderMode(orderMode?: string) {
    this.selectedOrderMode = orderMode || '';
  }

  onSelectedHour(hour: string) {
    this.selectedHour = hour;
  }

  onSelectedMinute(minute: string) {
    this.selectedMinute = minute;
  }

  clickOpenMenuDrawer() {
    this.hideCollapseContainer = false;
    this.showMenuDrawer = true;
  }

  closeCollapse() {
    this.hideCollapseContainer = true;
    this.showMenuDrawer = false;
  }

  clickContinueOrderMode() {
    if (this.selectedOrderMode === '') {
      this.goBack();
      return;
    }

    this.hideCollapseContainer = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
        ...(this.selectedHour && this.selectedMinute ? {
          takeAwayTime: `${this.selectedHour}:${this.selectedMinute}`,
        } : {}),
      },
      queryParamsHandling: 'merge',
    });

    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);
    this.qsApiService.getMenu(this.params.branchCode, selectedMode?.visitPurposeID!);

    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
      this.orderInput.type = selectedMode?.type!;
      this.orderInput.visitPurposeID = selectedMode?.visitPurposeID!;
    } else {
      this.orderInput = {
        type: selectedMode?.type!,
        typeName: null,
        amount: 0,
        deliveryAddress: '',
        deliveryAddressInfo: null,
        email: '',
        fullName: '',
        memberID: null,
        paymentMethodID: '',
        visitPurposeID: selectedMode?.visitPurposeID!,
        latitude: this.currentPosition.coords.latitude,
        longitude: this.currentPosition.coords.longitude,
        phoneNumber: '',
        promotionCode: '',
        salesMenus: [],
        vouchers: [],
        returnUrl: '',
      };
    }

    this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
  }

  goBack() {
    this.storageService.removeItem(`order_${this.params.companyCode}_${this.params.branchCode}`);
    this.router.navigate([`..`], { relativeTo: this.route });
  }

  goToMenu(menuID: number) {
    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);

    this.router.navigate([`menu/${menuID}`], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.queryParams.orderMode,
        visitPurposeID: selectedMode?.visitPurposeID!,
      },
    });
  }

  goToFragment(fragmentId: string) {
    this.hideCollapseContainer = true;
    this.showMenuDrawer = false;

    try {
      document.querySelector(`#${fragmentId.replace(/\W/g, '')}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    } catch(e) {
      // 
    }
  }

  async goToRestaurant(branchCode: string) {
    await this.router.navigate([`../${branchCode}`], { relativeTo: this.route, replaceUrl: true });
    window.location.reload();
  }

  goToSearchMenu() {
    const selectedMode = this.orderModes.find(mode => mode.type === this.selectedOrderMode);

    this.router.navigate([`search-menu`], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
        visitPurposeID: selectedMode?.visitPurposeID!,
      },
    });
  }

  goToCheckout() {
    this.router.navigate([`checkout`], {
      relativeTo: this.route,
      queryParams: {
        orderMode: this.selectedOrderMode,
      }
    });
  }

}