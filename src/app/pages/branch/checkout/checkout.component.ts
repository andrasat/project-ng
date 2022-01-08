import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IBranchData, ICalculateTotalResult, IMenuData, IMenus, IOrderInput, IPromotion } from '@core/models';
import { LocationService, NavigationService, QSApiService, StorageService } from '@core/services';
import { formatIDR } from '@utils/formatIDR';
import { separateAddress, getExternalAppData } from '@utils/index';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})

export class CheckoutComponent implements OnInit, OnDestroy {
  constructor(
    public route: ActivatedRoute,
    public qsApiService: QSApiService,
    public storageService: StorageService,
    public navigation: NavigationService,
    public locationService: LocationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
    route.parent?.params.subscribe(params => this.params = { ...this.params, ...params });
    route.queryParams.subscribe(queryParams => this.queryParams = { ...this.queryParams, ...queryParams });
  }

  private unsubscribe$ = new Subject<void>()

  promoCodeControl = new FormControl('')
  voucherCodeControl = new FormControl('')

  branchData: IBranchData | undefined
  menuData: IMenuData | undefined
  promotions: IPromotion[] | undefined
  menusAddMore: IMenus[]
  orderInput: IOrderInput
  calculateResult: ICalculateTotalResult
  externalAppData = getExternalAppData()

  hideCollapseContainer = true
  showPromoForm = false
  showVoucherForm = false
  showDeletePromo = false
  showDeleteVoucher = false
  selectedVoucherToDelete = ''
  disableContinueToPayment = false
  showAlertError = false
  alertErrorMessage = ''

  params: any = {}
  queryParams: any = {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    const orderInputData = this.storageService.getItem(`order_${this.params.companyCode}_${this.params.branchCode}`);
    const deliveryAddressInfo = this.storageService.getItem('deliveryAddressInfo');

    if (orderInputData) {
      this.orderInput = JSON.parse(orderInputData);
      this.orderInput.deliveryAddressInfo = deliveryAddressInfo;
      this.orderInput.email = this.queryParams.email || '';
      this.orderInput.memberID = this.queryParams.member || '';

      if (this.externalAppData) {
        this.orderInput.email = this.externalAppData.email || '';
        this.orderInput.phoneNumber = this.externalAppData.phone || '';
        this.orderInput.fullName = this.externalAppData.fullName || '';
        this.orderInput.deliveryAddress = this.externalAppData.deliveryAddress || '';
        this.orderInput.deliveryAddressInfo = this.externalAppData.deliveryAddressInfo || null;
      }

      if (!this.orderInput.salesMenus.length) {
        this.disableContinueToPayment = true;
        this.showAlertError = true;
        this.alertErrorMessage = 'Please add order to checkout';

        setTimeout(() => {
          this.showAlertError = false;
          this.alertErrorMessage = '';
        }, 3000);
      }

      this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    } else {
      return this.navigation.back('..', {
        queryParams: { mode: this.queryParams.mode },
      });
    }

    this.qsApiService.getBranchData(this.params.branchCode);
    this.qsApiService.getPromotion(this.params.branchCode);
    this.qsApiService.getMenu(this.params.branchCode, this.orderInput.visitPurposeID);

    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => {
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude, this.params.branchCode);
      });
    this.qsApiService.branchData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchData => this.branchData = branchData);
    this.qsApiService.promotion
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(promotions => this.promotions = promotions);
    this.qsApiService.currentAddress
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(address => {
        this.orderInput.deliveryAddress = `${address?.addressName}, ${address?.address}` || '';

        this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
      });
    this.qsApiService.menu
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(menu => {
        this.menuData = menu;

        const allMenus = menu?.menuCategories.reduce((menuList: IMenus[], menuCategory) => {
          const menuListByDetail = menuCategory.menuCategoryDetails.reduce((menus: IMenus[], menuCategoryDetail) => {
            return [...menus, ...menuCategoryDetail.menus];
          }, []);
          return [...menuList, ...menuListByDetail];
        }, []) || [];

        this.menusAddMore = menu?.menuCategories.reduce((menuList: IMenus[], menuCategory) => {
          const menuListByDetail = menuCategory.menuCategoryDetails.reduce((menus: IMenus[], menuCategoryDetail) => {
            return [...menus, ...menuCategoryDetail.menus];
          }, []);

          const relatedMenuIds = this.orderInput.salesMenus.reduce((menuIds: number[], saleMenu) => {
            const foundMenu = menuListByDetail.find(menuData => menuData.menuID === saleMenu.menuID);
            if (foundMenu) return [...menuIds, ...foundMenu.relatedMenus.map(data => data.menuID)];
            return menuIds;
          }, []);

          const relatedMenus = allMenus.reduce((filteredMenus: IMenus[], menuData) => {
            if (relatedMenuIds.includes(menuData.menuID)) {
              return [...filteredMenus, menuData];
            }

            return filteredMenus;
          }, []);

          return [...menuList, ...relatedMenus];
        }, []) || [];
      });

    if (this.queryParams.applyPromoCode) {
      this.orderInput.promotionCode = this.queryParams.applyPromoCode;

      this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    }

    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => this.calculateResult = result,
        error => {
          if (!this.showAlertError) {
            let errorMessage = error.message;

            try {
              errorMessage = JSON.parse(error.message);
            } catch(_) {
              errorMessage = error.message;
            } finally {
              this.showAlertError = true;

              switch(typeof errorMessage) {
                case 'object':
                  const joinedString = Object.keys(errorMessage).reduce((message, key) => {
                    return message === '' ? message + errorMessage[key] : `${message}, ${errorMessage[key]}`;
                  }, '');
                  this.alertErrorMessage = joinedString;
                  break;
                case 'string':
                  this.alertErrorMessage = errorMessage;
                  break;
              }

              setTimeout(() => {
                this.showAlertError = false;
                this.alertErrorMessage = '';
              }, 3000);
            }
          }
        },
      );
  }

  separateAddress(address: string) {
    return separateAddress(address);
  }

  formatToCurrency(price: number) {
    return formatIDR(price);
  }

  getOrderModeTitleText(mode: string) {
    switch (mode) {
      case 'dineIn':
        return 'DINE IN';
      case 'takeAway':
        return 'PICK UP AT';
      default:
        return 'CUSTOM ORDER';
    }
  }

  showPromoFormCollapse() {
    this.hideCollapseContainer = false;
    this.showPromoForm = true;
  }

  hidePromoFormCollapse() {
    this.hideCollapseContainer = true;
    this.showPromoForm = false;
  }

  showPromoDeleteCollapse() {
    this.hideCollapseContainer = false;
    this.showDeletePromo = true;
  }

  hidePromoDeleteCollapse() {
    this.hideCollapseContainer = true;
    this.showDeletePromo = false;
  }

  showVoucherFormCollapse() {
    this.hideCollapseContainer = false;
    this.showVoucherForm = true;
  }

  hideVoucherFormCollapse() {
    this.hideCollapseContainer = true;
    this.showVoucherForm = false;
  }

  showVoucherDeleteCollapse(voucherCode: string) {
    this.hideCollapseContainer = false;
    this.showDeleteVoucher = true;
    this.selectedVoucherToDelete = voucherCode;
  }

  hideVoucherDeleteCollapse() {
    this.hideCollapseContainer = true;
    this.showDeleteVoucher = false;
    this.selectedVoucherToDelete = '';
  }

  getPromoCodeControlError() {
    return this.promoCodeControl.errors?.['apiError'];
  }

  getVoucherCodeControlError() {
    return this.voucherCodeControl.errors?.['apiError'];
  }

  removePromoCode() {
    this.orderInput.promotionCode = '';

    this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .subscribe(
        result => this.calculateResult = result,
        error => {
          if (!this.showAlertError) {
            const errorMessage = JSON.parse(error.message);
            this.showAlertError = true;

            switch(typeof errorMessage) {
              case 'object':
                const joinedString = Object.keys(errorMessage).reduce((message, key) => {
                  return message === '' ? message + errorMessage[key] : `${message}, ${errorMessage[key]}`;
                }, '');
                this.alertErrorMessage = joinedString;
                break;
              case 'string':
                this.alertErrorMessage = errorMessage;
                break;
            }
          }
        },
      );

    this.navigation.navigate(undefined, {
      queryParams: {
        mode: this.queryParams.mode,
      },
      replaceUrl: true,
    });

    this.hidePromoDeleteCollapse();
  }

  removeVoucherCode() {
    const foundVoucherToDeleteIndex = this.orderInput.vouchers.findIndex(voucherCode => voucherCode === this.selectedVoucherToDelete);
    if (foundVoucherToDeleteIndex < 0) {
      this.hideVoucherDeleteCollapse();
      return;
    }

    this.orderInput.vouchers.splice(foundVoucherToDeleteIndex, 1);
    this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));
    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .subscribe(
        result => this.calculateResult = result,
        error => {
          if (!this.showAlertError) {
            const errorMessage = JSON.parse(error.message);
            this.showAlertError = true;

            switch(typeof errorMessage) {
              case 'object':
                const joinedString = Object.keys(errorMessage).reduce((message, key) => {
                  return message === '' ? message + errorMessage[key] : `${message}, ${errorMessage[key]}`;
                }, '');
                this.alertErrorMessage = joinedString;
                break;
              case 'string':
                this.alertErrorMessage = errorMessage;
                break;
            }
          }
        },
      );

    this.hideVoucherDeleteCollapse();
  }

  applyPromoCode() {
    if (!this.promoCodeControl.valid) return;

    this.orderInput.promotionCode = this.promoCodeControl.value;
    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .subscribe(
        result => {
          this.calculateResult = result;
          this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));

          this.hidePromoFormCollapse();
        },
        () => {
          this.orderInput.promotionCode = '';
          this.promoCodeControl.setErrors({ apiError: true });
        }
      );
  }

  applyVoucherCode() {
    if (!this.voucherCodeControl.valid) return;
    const foundVoucher = this.orderInput.vouchers.find(voucherCode => voucherCode === this.voucherCodeControl.value);

    if (foundVoucher) {
      this.hideVoucherFormCollapse();
      return;
    }

    this.orderInput.vouchers = [ ...this.orderInput.vouchers, this.voucherCodeControl.value ];
    this.qsApiService.calculateTotal({ ...this.orderInput, orderType: this.orderInput.type }, this.params.branchCode)
      .subscribe(
        result => {
          this.calculateResult = result;
          this.storageService.setItem(`order_${this.params.companyCode}_${this.params.branchCode}`, JSON.stringify(this.orderInput));

          this.hideVoucherFormCollapse();
        },
        () => {
          this.orderInput.vouchers = this.orderInput.vouchers.reduce((arr: string[], v) => v === this.voucherCodeControl.value ? arr : [...arr, v], []);
          this.voucherCodeControl.setErrors({ apiError: true });
        }
      );
  }

  toPayment() {
    this.navigation.navigate('../payment', {
      relativeTo: this.route,
      queryParams: {
        mode: this.queryParams.mode,
      }
    });
  }

  goToRestaurant() {
    this.navigation.navigate('..', {
      relativeTo: this.route,
      queryParams: {
        mode: this.queryParams.mode,
      }
    });
  }

  goToPromoDetail(promotion: IPromotion) {
    this.navigation.navigate(`/${this.params.companyCode}/promotion/${promotion.promotionID}`, {
      queryParams: {
        mode: this.queryParams.mode,
        companyCode: this.params.companyCode,
        branchCode: this.params.branchCode,
        title: promotion.notes,
        promoCode: promotion.promotionCode,
        from: 'checkout',
      },
    });
  }

  goToContacts() {
    this.navigation.navigate('/contacts', {
      queryParams: {
        mode: this.queryParams.mode,
        companyCode: this.params.companyCode,
        branchCode: this.params.branchCode,
        from: 'checkout',
      },
    });
  }

  goToMenu(menuID: number) {
    this.navigation.navigate(`../menu/${menuID}`, {
      relativeTo: this.route,
      queryParams: {
        mode: this.queryParams.mode,
        visitPurposeID: this.orderInput.visitPurposeID,
        edit: true,
      }
    });
  }

  goToHome() {
    this.navigation.navigate('../..', {
      relativeTo: this.route,
    });
  }

  goToSearchRestaurant() {
    this.navigation.navigate('/search-restaurant', {
      queryParams: {
        companyCode: this.params.companyCode,
        branchCode: this.params.branchCode,
        from: 'checkout',
      }
    });
  }

  goToSearchLocation() {
    this.navigation.navigate('/location', {
      queryParams: {
        companyCode: this.params.companyCode,
        branchCode: this.params.branchCode,
        from: 'checkout',
      }
    });
  }
}